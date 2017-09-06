import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import OperationModel from '../realm/models/OperationModel'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'

export default connectRealm(
  (realm, ownProps) => ({
    allItems: OperationModel.getSortedBySortNumber(realm),
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        primaryText={item.name}
        secondaryText={item.code}
        disabled={item.disabled}
        onItemPress={() => ownProps.navigation.openCreateSession(item)}/>
    )
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData, keyboardShouldPersistTaps: 'handled'}),
  (mapRealmProps, mapProps, ownProps) => {
    return {
      ...mapRealmProps,
      ...mapProps,
      items: OperationModel.search(mapRealmProps.allItems,
        ownProps.navigation.state.params && ownProps.navigation.state.params.search)
    }
  }
)(List)