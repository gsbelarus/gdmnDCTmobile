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

      state = {
        extraData: false
      }

      _realmProps = {}

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
        this.setState({extraData: !this.state.extraData})
      }

      _addListeners (context) {
        if (this._realmProps) {
          if (context.reactRealmInstance) {
            context.reactRealmInstance.addListener('change', this._update)
          }
        }
      }

      _removeListeners (context) {
        if (this._realmProps) {
          if (context.reactRealmInstance) {
            context.reactRealmInstance.removeListener('change', this._update)
          }
        }
      }

      componentWillUpdate (nextProps, nextState, nextContext) {
        if (this.context.reactRealmInstance.path !== nextContext.reactRealmInstance.path) {
          this._removeListeners(this.context)
          this._initRealmProps(nextProps, nextContext)
          this._addListeners(nextContext)
        }
      }

      componentDidMount () {
        this._addListeners(this.context)
      }

      componentWillUnmount () {
        this._removeListeners(this.context)
      }

      render () {
        return (
          <WrappedComponent {...mergeProps(this._realmProps, mapToProps(this.state.extraData, this.props), this.props)} />
        )
      }
    }
  }
}