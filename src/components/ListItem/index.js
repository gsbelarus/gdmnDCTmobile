import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { LayoutAnimation, Text, Vibration, View } from 'react-native'
import AutoBind from 'autobind-decorator'
import Icon from 'react-native-vector-icons/MaterialIcons'
import TouchableView from '../TouchableView'
import styles from './styles'

export default class ListItem extends PureComponent {

  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    primaryText: PropTypes.string,
    secondaryText: PropTypes.string,
    itemDisabled: PropTypes.bool,
    itemDisabledColor: PropTypes.string,
    onItemPress: PropTypes.func,
    onItemLongPress: PropTypes.func,
    onItemIconRightPress: PropTypes.func,
    iconRightName: PropTypes.string,
    primaryTextStyle: Text.propTypes.style,
    secondaryTextStyle: Text.propTypes.style,
    iconRightStyle: Text.propTypes.style,
    style: View.propTypes.style
  }

  static defaultProps = {
    onItemPress: () => {},
    onItemIconRightPress: () => {},
    itemDisabledColor: 'transparent'
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  @AutoBind
  _onItemPress () {
    this.props.onItemPress(this.props.id)
  }

  @AutoBind
  _onItemLongPress () {
    if (this.props.onItemLongPress) {
      Vibration.vibrate(50)
      this.props.onItemLongPress(this.props.id)
    }
  }

  @AutoBind
  _onItemIconRightPress () {
    this.props.onItemIconRightPress(this.props.id)
  }

  render () {
    return (
      <TouchableView
        delayPressIn={0}
        disabled={this.props.itemDisabled}
        onPress={this._onItemPress}
        onLongPress={this._onItemLongPress}>
        <View
          style={[
            styles.itemContainer,
            this.props.style,
            this.props.itemDisabled ? {backgroundColor: this.props.itemDisabledColor} : null
          ]}>
          <View style={[styles.itemTextContainer, this.props.iconRightName ? {minHeight: 24} : null]}>
            {this.props.primaryText
              ? (
                <Text style={[styles.itemPrimaryText, this.props.primaryTextStyle]}>
                  {this.props.primaryText}
                </Text>
              ) : null}
            {this.props.secondaryText
              ? (
                <Text style={[styles.itemSecondaryText, this.props.secondaryTextStyle]}>
                  {this.props.secondaryText}
                </Text>
              ) : null}
          </View>
          {this.props.iconRightName
            ? (
              <View style={this.props.primaryText && this.props.secondaryText ? {marginTop: 8} : null}>
                <TouchableView
                  delayPressIn={0}
                  borderless={true}
                  onPress={this._onItemIconRightPress}>
                  <Icon name={this.props.iconRightName} style={[styles.itemIconRight, this.props.iconRightStyle]}/>
                </TouchableView>
              </View>
            ) : null}
        </View>
      </TouchableView>
    )
  }
}