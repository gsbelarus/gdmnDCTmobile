import React from 'react'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'
import { formatDate } from '../localization/utils'
import { connectRealm } from '../realm/contextRealm'
import SessionModel from '../realm/models/SessionModel'

export default connectRealm(
  (realm, ownProps) => ({
    items: SessionModel.getSortedByDate(realm, true),
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        primaryText={`${item.operator.name} / ${item.operation.name}`}
        secondaryText={formatDate(item.time, 'Do MMMM YYYY, HH:mm')}
        iconRightName={'delete'}
        onItemPress={() => ownProps.openSessionDetail(item)}
        onItemIconRightPress={() => ownProps.deleteSessionDetail(item)}
        style={{backgroundColor: item.exported ? '#50C85030' : '#C8505030'}}/>
    ),
    actionVisible: true,
    onActionPress: () => ownProps.openCreateSession(realm)
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)(List)