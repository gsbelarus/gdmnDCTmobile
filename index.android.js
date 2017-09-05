import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry, UIManager } from 'react-native'
import ScannerApi from 'react-native-android-scanner'
import configureStore from './src/redux/configureStore'
import AppContainer from './src/containers/AppContainer'
import scannerCallbackTask from './src/scannerCallbackTask'

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

const store = configureStore()

export default class Index extends Component {

  render () {
    return (
      <Provider store={store}>
        <AppContainer/>
      </Provider>
    )
  }
}

AppRegistry.registerComponent(require('./app.json').name, () => Index)
AppRegistry.registerHeadlessTask(ScannerApi.SCANNER_CALLBACK_TASK, () => scannerCallbackTask)