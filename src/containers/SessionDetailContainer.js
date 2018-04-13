import React from 'react'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'
import { connectRealm } from '../realm/contextRealm'
import SessionModel from '../realm/models/SessionModel'

@connectRealm(
  (realm, ownProps) => ({
    items: SessionModel.findSessionByKey(realm, ownProps.navigation.state.params.sessionKey).codes,
    renderItem: ({item, index}) => (
      <ListItem
        id={item.id}
        primaryText={item.name}
        secondaryText={item.storingPlace.name}
        itemDisabled={true}/>
    )
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)
export default class SessionDetailContainer extends React.PureComponent {

  render () {
    return (
      <List
        {...this.props}
        {...this.props.items.isValid() ? {} : {items: []}}
      />
    )
  }
}