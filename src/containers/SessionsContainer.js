import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import SessionModel from '../realm/models/SessionModel'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'
import { formatDate } from '../localization/utils'

export default connectRealm(
  (realm, ownProps) => ({
    items: SessionModel.getSortedByDate(realm, true),
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        primaryText={`${item.operator.name} / ${item.operation.name} / ${item.storingPlace.name}`}
        secondaryText={formatDate(item.time, 'Do MMMM YYYY, HH:mm')}
        iconRightName={'clear'}
        onItemPress={() => ownProps.openSessionDetail(item)}
        onItemIconRightPress={() => {
          realm.write(() => realm.delete(item))
        }}
        style={{backgroundColor: item.exported ? '#50C85030' : '#C8505030'}}/>
    ),
    actionVisible: true,
    onActionPress: () => ownProps.openCreateSession(realm)
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)(List)