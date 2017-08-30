import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import ProgressModal from '../components/ProgressModal'

export default connect(
  (state) => ({
    visible: state.progressState.visible,
    label: state.progressState.currentProgress && state.progressState.currentProgress.message,
    progressColor: 'white',
    progressStyle: styles.progress,
    labelStyle: styles.label,
    style: styles.container
  })
)(ProgressModal)

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black'
  },
  label: {},
  progress: {}
})