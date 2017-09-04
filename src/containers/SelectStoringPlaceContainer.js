import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import StoringPlaceModel from '../realm/models/StoringPlaceModel'
import List from '../components/List/index'
import SimpleListItem from '../components/SimpleListItem/index'

export default connectRealm(
  (realm, ownProps) => ({
    items: StoringPlaceModel.search(StoringPlaceModel.getSortedByName(realm),
      ownProps.navigation.state.params && ownProps.navigation.state.params.search),
    renderItem: ({item}) => (
      <SimpleListItem
        id={item.id}
        primaryText={item.name}
        secondaryText={item.code}
        disabled={item.disabled}
        onPress={() => ownProps.navigation.openCreateSession(item)}/>
    )
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData, keyboardShouldPersistTaps: 'handled'}),
  (ownProps, newOwnProps) => (ownProps.navigation.state.params !== newOwnProps.navigation.state.params)
)(List)