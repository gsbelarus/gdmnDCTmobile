import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import ActionButton from 'react-native-action-button'
import { formatDate } from '../localization/utils'
import List from './List/index'
import ListItem from './ListItem/index'

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
    onItemIconRightPress: PropTypes.func,
    keyExtractor: PropTypes.func
  }

  static defaultProps = {
    extra: {},
    items: [],
    keyExtractor: (item, index) => index
  }

  constructor (props) {
    super(props)

    this._renderItem = this._renderItem.bind(this)
  }

  _renderItem ({item}) {
    return (
      <ListItem
        id={item.id}
        primaryText={item.operator.name}
        secondaryText={formatDate(item.time, 'Do MMMM YYYY, HH:mm')}
        iconRightName={'clear'}
        onItemPress={() => this.props.onItemPress(item)}
        onItemLongPress={() => this.props.onItemLongPress(item)}
        onItemIconRightPress={() => this.props.onItemIconRightPress(item)}/>
    )
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <List
          extra={this.props.extra}
          items={this.props.items}
          renderItem={this._renderItem}/>
        <ActionButton onPress={this.props.onAddPress}/>
      </View>
    )
  }
}