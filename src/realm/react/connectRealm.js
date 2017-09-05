import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default function connectRealm (mapToRealmProps = (realm, ownProps) => ({realm}),
                                      mapToProps = (extraData, ownProps) => ({...ownProps, extraData}),
                                      mergeProps = (mapRealmProps, mapProps, ownProps) => ({...mapRealmProps, ...mapProps})) {
  return (WrappedComponent) => {
    return class ConnectedRealmContainer extends PureComponent {

      static contextTypes = {
        reactRealmInstance: PropTypes.object
      }

      _realmProps = {}
      _extraData = false

      constructor (props, context) {
        super(props, context)

        this._initRealmProps(props, context)

        this._update = this._update.bind(this)
      }

      _initRealmProps (props, context) {
        if (context.reactRealmInstance) {
          this._realmProps = mapToRealmProps(context.reactRealmInstance, props)
        }
      }

      _update (objects, changes) {
        this._extraData = !this._extraData
        this.forceUpdate()
      }

      _addListeners () {
        if (this._realmProps) {
          for (let prop in this._realmProps) {
            if (this._realmProps[prop].addListener) {
              try {
                this._realmProps[prop].addListener(this._update)
              } catch (ignore) {}
            }
          }
        }
      }

      _removeListeners () {
        if (this._realmProps) {
          for (let prop in this._realmProps) {
            if (this._realmProps[prop].addListener) {
              try {
                this._realmProps[prop].removeListener(this._update)
              } catch (ignore) {}
            }
          }
        }
      }

      componentWillUpdate (nextProps, nextState, nextContext) {
        if (this.context.reactRealmInstance.path !== nextContext.reactRealmInstance.path) {
          this._removeListeners()
          this._initRealmProps(nextProps, nextContext)
          this._addListeners()
        }
      }

      componentWillMount () {
        this._addListeners()
      }

      componentWillUnmount () {
        this._removeListeners()
      }

      render () {
        return (
          <WrappedComponent {...mergeProps(this._realmProps, mapToProps(this._extraData, this.props), this.props)} />
        )
      }
    }
  }
}