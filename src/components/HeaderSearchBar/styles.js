import { Platform, StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 2,
    borderColor: 'black',
    borderWidth: Platform.Version > 20 ? 0 : 1
  },
  textInput: {
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 2,
    fontSize: 16,
  }
})