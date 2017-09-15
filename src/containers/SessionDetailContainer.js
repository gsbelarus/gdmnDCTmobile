import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import SessionModel from '../realm/models/SessionModel'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'

export default connectRealm(
  (realm, ownProps) => ({
    items: SessionModel.findSessionByKey(realm, ownProps.navigation.state.params.sessionKey).codes,
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        primaryText={item.name}
        itemDisabled={true}/>
    )
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)((props) => {
  return <List
    {...props}
    {...props.items.isValid() ? {} : {items: []}}
    />
})