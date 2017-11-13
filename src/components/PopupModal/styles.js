import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  contentPopup: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#FAFAFA',
    borderRadius: 2,
    elevation: 8
  },
  title: {
    margin: 24,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  description: {
    fontSize: 16
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 15
  },
  buttonNeutralContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  button: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    minWidth: 60,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold'
  },
  hidden: {
    display: 'none'
  }
})