import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import OperatorModel from '../realm/models/OperatorModel'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'

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