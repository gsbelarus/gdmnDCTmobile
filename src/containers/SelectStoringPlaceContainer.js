import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import StoringPlaceModel from '../realm/models/StoringPlaceModel'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'

export default connectRealm(
  (realm, ownProps) => ({
    allItems: StoringPlaceModel.getSortedByName(realm),
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        primaryText={item.name}
        secondaryText={item.code}
        onItemPress={() => ownProps.onItemPress(item)}
        style={ownProps.selectedKey === item.id ? {backgroundColor: 'rgba(0, 0, 0, .32)'} : null}/>
    )
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData, keyboardShouldPersistTaps: 'handled'}),
  (mapRealmProps, mapProps, ownProps) => {
    return {
      ...mapRealmProps,
      ...mapProps,
      items: StoringPlaceModel.search(mapRealmProps.allItems, ownProps.search)
    }
  }
)(List)