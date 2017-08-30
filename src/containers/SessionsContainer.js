import React from 'react'
import connectRealm from '../realm/react/connectRealm'
import SessionModel from '../realm/models/SessionModel'
import Sessions from '../components/Sessions'
import { ExportManager } from '../fsManager'

export default connectRealm(
  (realm, ownProps) => ({
    items: SessionModel.getSortedByDate(realm, true),
    onAddPress: ownProps.navigation.openCreateSession,
    onItemPress: (item) => {  //TODO
      realm.write(() => {
        realm.delete(item.codes)
        realm.delete(item)
      })
    },
    onItemLongPress: async (item) => {  //TODO
      await ExportManager.exportSession(item)
    }
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)(Sessions)