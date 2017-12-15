import React from 'react'
import DialogAndroid from 'react-native-dialogs'
import connectRealm from '../realm/react/connectRealm'
import SessionModel from '../realm/models/SessionModel'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'
import { formatDate } from '../localization/utils'
import strings, {
  STRING_ACTION_CANCEL,
  STRING_ACTION_CONFIRM,
  STRING_ACTION_DELETE,
  STRING_NOTIFICATION
} from '../localization/strings'

function showDeleteConfirmDialog (onConfirm) {
  let dialog = new DialogAndroid()
  dialog.set({
    title: strings(STRING_NOTIFICATION),
    content: strings(STRING_ACTION_DELETE) + '?',
    positiveText: strings(STRING_ACTION_CONFIRM),
    negativeText: strings(STRING_ACTION_CANCEL),
    onPositive: onConfirm
  })
  dialog.show()
}

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
        onItemIconRightPress={() => {
          showDeleteConfirmDialog(() => {
            realm.write(() => realm.delete(item))
          })
        }}
        style={{backgroundColor: item.exported ? '#50C85030' : '#C8505030'}}/>
    ),
    actionVisible: true,
    onActionPress: () => ownProps.openCreateSession(realm)
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)(List)