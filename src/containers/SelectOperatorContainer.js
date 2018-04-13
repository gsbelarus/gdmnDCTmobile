import React from 'react'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'
import OperatorModel from '../realm/models/OperatorModel'
import connectRealm from '../realm/react/connectRealm'

export default connectRealm(
  (realm, ownProps) => ({
    items: OperatorModel.getSortedByName(realm),
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        primaryText={item.name}
        onItemPress={() => ownProps.openCreateSession(realm, item)}/>
    )
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)(List)
