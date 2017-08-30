import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import OperationModel from '../realm/models/OperationModel'
import List from '../components/List/index'
import SimpleListItem from '../components/SimpleListItem/index'

export default connectRealm(
  (realm, ownProps) => ({
    items: OperationModel.getSortedBySortNumber(realm),
    renderItem: ({item}) => (
      <SimpleListItem
        id={item.id}
        primaryText={item.name}
        disabled={item.disabled}
        onPress={() => ownProps.navigation.openCreateSession(item)}/>
    )
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)(List)