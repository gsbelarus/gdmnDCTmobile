import React from 'react'

const {Provider: RealmProvider, Consumer: RealmConsumer} = React.createContext(null)

export { RealmProvider }

export function connectRealm (mapToRealmProps = (realm, ownProps) => ({realm}),
                              mapToProps = (extraData, ownProps) => ({...ownProps, extraData}),
                              mergeProps = (mapRealmProps, mapProps, ownProps) => ({...mapRealmProps, ...mapProps})) {
  return (WrappedComponent) => {
    class ConnectedRealmContainer extends React.PureComponent {

      state = {
        extraData: false
      }

      _realmProps = {}

      constructor (props, context) {
        super(props, context)

        this._initRealmProps(props)

        this._update = this._update.bind(this)
      }

      _initRealmProps ({realm, ...props}) {
        if (realm) {
          this._realmProps = mapToRealmProps(realm, props)
        }
      }

      _update (objects, changes) {
        this.setState({extraData: !this.state.extraData})
      }

      _addListeners ({realm}) {
        if (this._realmProps) {
          if (realm) {
            realm.addListener('change', this._update)
          }
        }
      }

      _removeListeners ({realm}) {
        if (this._realmProps) {
          if (realm) {
            realm.removeListener('change', this._update)
          }
        }
      }

      componentDidUpdate (prevProps, prevState, snapshot) {
        if (prevProps.realm &&
          prevProps.realm.path !== this.props.realm.path) {

          this._removeListeners(prevProps)
          this._initRealmProps(this.props)
          this._addListeners(this.props)
        }
      }

      componentDidMount () {
        this._addListeners(this.props)
      }

      componentWillUnmount () {
        this._removeListeners(this.props)
      }

      render () {
        return (
          <WrappedComponent {...mergeProps(this._realmProps, mapToProps(this.state.extraData, this.props), this.props)}/>
        )
      }
    }

    return (props) => (
      <RealmConsumer>
        {realm => <ConnectedRealmContainer realm={realm} {...props}/>}
      </RealmConsumer>
    )
  }
}