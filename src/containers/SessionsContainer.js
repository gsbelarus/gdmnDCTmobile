import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import SessionModel from '../realm/models/SessionModel'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'
import { formatDate } from '../localization/utils'
import { ExportManager } from '../fsManager'

export default connectRealm(
  (realm, ownProps) => ({
    items: SessionModel.getSortedByDate(realm, true),
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        primaryText={item.operator.name}
        secondaryText={formatDate(item.time, 'Do MMMM YYYY, HH:mm')}
        iconRightName={'clear'}
        onItemPress={() => ownProps.navigation.openSessionDetail(item)}
        onItemLongPress={async (item) => {
          await ExportManager.exportSession(item)
        }}
        onItemIconRightPress={() => {
          realm.write(() => {
            realm.delete(item.codes)
            realm.delete(item)
          })
        }}/>
    ),
    actionVisible: true,
    onActionPress: ownProps.navigation.openCreateSession
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)(List)