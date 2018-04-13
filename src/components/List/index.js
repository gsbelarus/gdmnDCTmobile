import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ColorPropType, FlatList, LayoutAnimation, View, ViewPropTypes } from 'react-native'
import ActionButton from 'react-native-action-button'
import EmptyView from '../EmptyView/index'
import styles from './styles'

export default class List extends PureComponent {

  static propTypes = {
    extra: PropTypes.any,
    items: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled', false, true]),
    actionVisible: PropTypes.bool,
    actionColor: ColorPropType,
    actionRippleColor: ColorPropType,
    actionIcon: PropTypes.element,
    renderItem: PropTypes.func.isRequired,
    separator: PropTypes.func,
    keyExtractor: PropTypes.func,
    onActionPress: PropTypes.func,
    style: ViewPropTypes.style
  }

  static defaultProps = {
    extra: {},
    items: [],
    keyExtractor: (item, index) => `${index}`,
    onActionPress: () => {}
  }

  state = {
    width: 0,
    height: 0
  }

  constructor (props, context) {
    super(props, context)

    this._onLayout = this._onLayout.bind(this)
  }

  static _renderSeparator () {
    return <View style={styles.separator}/>
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
      <View style={[styles.container, this.props.style]}>
        <FlatList
          onLayout={this._onLayout}
          extraData={this.props.extra}
          keyExtractor={this.props.keyExtractor}
          data={this.props.items}
          renderItem={this.props.renderItem}
          keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
          ItemSeparatorComponent={this.props.separator ? this.props.separator : List._renderSeparator}
          ListEmptyComponent={
            <EmptyView
              style={{
                width: this.state.width,
                height: this.state.height
              }}/>
          }
          contentContainerStyle={[styles.content, this.props.items.length ? null : {paddingVertical: 0}]}/>
        {this.props.actionVisible
          ? (
            <ActionButton
              icon={this.props.actionIcon}
              fixNativeFeedbackRadius={true}
              nativeFeedbackRippleColor={this.props.actionRippleColor}
              buttonColor={this.props.actionColor}
              onPress={this.props.onActionPress}/>
          ) : null}
      </View>
    )
  }
}