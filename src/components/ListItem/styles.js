import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    minHeight: 48
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 8
  },
  itemPrimaryText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: 'black'
  },
  itemSecondaryText: {
    fontFamily: 'Roboto',
    fontSize: 13
  },
  itemIconRight: {
    fontSize: 24,
    padding: 8
  }
})