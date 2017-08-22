import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', //GREY_50
  },
  buttonsContainer: {
    alignItems: 'center'
  },
  confirmButton: {
    height: 40,
    width: 150,
    margin: 7,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    height: 40,
    width: 150,
    margin: 7,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmText: {
    color: 'white'
  },
  cancelText: {
    color: 'white'
  }
})