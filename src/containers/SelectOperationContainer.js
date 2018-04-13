import React from 'react'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'
import { connectRealm } from '../realm/contextRealm'
import OperationModel from '../realm/models/OperationModel'

export default connectRealm(
  (realm, ownProps) => ({
    allItems: OperationModel.getSortedBySortNumber(realm),
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        primaryText={item.name}
        secondaryText={item.code}
        onItemPress={() => ownProps.openCreateSession(realm, item)}/>
    )
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData, keyboardShouldPersistTaps: 'handled'}),
  (mapRealmProps, mapProps, ownProps) => {
    return {
      ...mapRealmProps,
      ...mapProps,
      items: OperationModel.search(mapRealmProps.allItems, ownProps.search)
    }
  }
)(List)
