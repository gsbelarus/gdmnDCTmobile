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
    keyExtractor: PropTypes.func,
    keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled', false, true])
  }

  static defaultProps = {
    extra: {},
    items: [],
    keyExtractor: (item, index) => index
  }

  state = {
    width: 0,
    height: 0
  }

  constructor () {
    super()

    this._onLayout = this._onLayout.bind(this)
  }

  _onLayout (event) {
    const {width, height} = event.nativeEvent.layout
    this.setState({width, height})
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  render () {
    return (
      <FlatList
        onLayout={this._onLayout}
        extraData={this.props.extra}
        keyExtractor={this.props.keyExtractor}
        data={this.props.items}
        renderItem={this.props.renderItem}
        keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
        ItemSeparatorComponent={() => <View style={styles.separator}/>}
        ListEmptyComponent={
          <EmptyView style={{
            width: this.state.width,
            height: this.state.height
          }}/>
        }
        contentContainerStyle={[styles.content, this.props.items.length ? null : {paddingVertical: 0}]}
        style={styles.container}/>
    )
  }
}