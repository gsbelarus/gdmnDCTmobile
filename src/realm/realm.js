import Realm from 'realm'
import SessionModel from './models/SessionModel'
import OperatorModel from './models/OperatorModel'
import StoringPlaceModel from './models/StoringPlaceModel'
import OperationModel from './models/OperationModel'
import createDemoData from './demoData'
import CodeModel from './models/CodeModel'

const realm = new Realm({
  schema: [SessionModel, OperatorModel, StoringPlaceModel, OperationModel, CodeModel],
  schemaVersion: 16
})

createDemoData(realm)

export default realm