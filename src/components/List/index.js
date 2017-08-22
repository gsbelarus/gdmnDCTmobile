import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FlatList, LayoutAnimation, View } from 'react-native'
import EmptyView from '../EmptyView/index'
import styles from './styles'

export default class List extends PureComponent {

  static propTypes = {
    extra: PropTypes.any,
    items: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool.isRequired
      })),
      PropTypes.object
    ]),
    renderItem: PropTypes.func.isRequired,
    keyExtractor: PropTypes.func
  }

  static defaultProps = {
    extra: {},
    items: [],
    keyExtractor: (item, index) => index
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  render () {
    return (
      <FlatList
        extraData={this.props.extra}
        keyExtractor={this.props.keyExtractor}
        data={this.props.items}
        renderItem={this.props.renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator}/>}
        ListEmptyComponent={<EmptyView/>}
        contentContainerStyle={styles.content}
        style={styles.container}/>
    )
  }
}