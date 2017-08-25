import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import ActionButton from 'react-native-action-button'
import { formatDate } from '../localization/utils'
import List from '../components/List/index'

export default class Sessions extends PureComponent {

  static propTypes = {
    extra: PropTypes.any,
    items: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        time: PropTypes.instanceOf(Date).isRequired
      })),
      PropTypes.object
    ]),
    onAddPress: PropTypes.func,
    onItemPress: PropTypes.func,
    onItemLongPress: PropTypes.func,
    keyExtractor: PropTypes.func
  }

  static defaultProps = {
    extra: {},
    items: [],
    onAddPress: () => {},
    onItemPress: () => {},
    onItemLongPress: () => {},
    keyExtractor: (item, index) => index
  }

  constructor (props) {
    super(props)

    this.renderItem = this.renderItem.bind(this)
  }

  renderItem ({item}) {
    return (
      <TouchableNativeFeedback
        onPress={() => this.props.onItemPress(item)}
        onLongPress={() => this.props.onItemLongPress(item)}
        background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemPrimaryText}>{item.operator.name}</Text>
          <Text style={styles.itemSecondaryText}>{formatDate(item.time, 'Do MMMM YYYY, HH:mm:ss')}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <List
          extra={this.props.extra}
          items={this.props.items}
          renderItem={this.renderItem}/>
        <ActionButton onPress={this.props.onAddPress}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    minHeight: 72,
    padding: 16
  },
  itemPrimaryText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: 'black'
  },
  itemSecondaryText: {
    fontFamily: 'Roboto',
    fontSize: 14
  }
})