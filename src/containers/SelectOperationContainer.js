import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import OperationModel from '../realm/models/OperationModel'
import List from '../components/List/index'
import SimpleListItem from '../components/SimpleListItem/index'

export default connectRealm(
  (realm, ownProps) => ({
    items: OperationModel.search(OperationModel.getSortedBySortNumber(realm),
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