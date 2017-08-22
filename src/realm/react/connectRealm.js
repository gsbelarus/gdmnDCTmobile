import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default function connectRealm (realmMapToProps, mapToProps) {
  return (WrappedComponent) => {
    return class ConnectedRealmContainer extends PureComponent {

      static contextTypes = {
        reactRealmInstance: PropTypes.object
      }

      realmProps = {}
      extraData = false

      constructor (props, context) {
        super(props, context)

        if (context.reactRealmInstance) {
          this.realmProps = realmMapToProps(context.reactRealmInstance, props)
        }

        this.update = this.update.bind(this)
      }

      update (objects, changes) {
        this.extraData = !this.extraData
        this.forceUpdate()
      }

      addListeners () {
        if (this.realmProps) {
          for (let prop in this.realmProps) {
            if (this.realmProps[prop].addListener) {
              try {
                this.realmProps[prop].addListener(this.update)
              } catch (ignore) {}
            }
          }
        }
      }

      removeListeners () {
        if (this.realmProps) {
          for (let prop in this.realmProps) {
            if (this.realmProps[prop].addListener) {
              try {
                this.realmProps[prop].removeListener(this.update)
              } catch (ignore) {}
            }
          }
        }
      }

      componentWillUpdate (nextProps, nextState, nextContext) {
        if (this.context.reactRealmInstance.path !== nextContext.reactRealmInstance.path) {
          this.removeListeners()
          this.realmProps = realmMapToProps(nextContext.reactRealmInstance, nextProps.props)
          this.addListeners()
        }
      }

      componentWillMount () {
        this.addListeners()
      }

      componentWillUnmount () {
        this.removeListeners()
      }

      render () {
        return (
          <WrappedComponent
            {...this.realmProps}
            {...(mapToProps ? mapToProps(this.extraData, this.props) : this.props)} />
        )
      }
    }
  }
}