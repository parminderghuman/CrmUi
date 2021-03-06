/**
 * Multiple select list with search
 * ataomega@gmail.com
 * www.atasmohammadi.net
 * version 1.0
 */
import React, { Component, PropTypes } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  Modal,
  TouchableHighlightBase
} from 'react-native';
import { Icon } from 'react-native-elements'

var { width, height } = Dimensions.get('window');

export default class CustomPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageWidth: Dimensions.get('window').width,
      pageHeight: Dimensions.get('window').height,
      searchText: null,
      selected: []
    };
  }

  componentDidMount = () => {
    const selected = this.props.selected

    if (typeof selected === "object") {
      selected.map(select => {
        this._onSelect(select)
      })
    } else {
      this._onSelect(selected)
    }
  }

  getNewDimensions(event) {
    var pageHeight = event.nativeEvent.layout.height
    var pageWidth = event.nativeEvent.layout.width
    this.setState({
      pageHeight, pageWidth
    })
  }

  _onSelect = (item) => {
    var selected = this.state.selected
    if (this.props.multiple) {
      if (selected.indexOf(item) == -1) {
        selected.push(item)
        this.setState({
          selected: selected
        })
      } else {
        selected = selected.filter(i => i != item)
        this.setState({
          selected: selected
        })
      }
    } else {
      
      if (selected.indexOf(item) == -1) {
        selected = [item]
        this.setState({
          selected: selected
        })
      } else {
        selected = []
        this.setState({
          selected: selected
        })
      }
    }
    this.props.callback(selected)
  }

  _onSearch = (text) => {
    this.setState({
      searchText: text.length > 0 ? text.toLowerCase() : null
    })
  }

  _isSelected = (item) => {
    const selected = this.state.selected

    if (selected.indexOf(item) == -1) {
      return false
    }
    return true
  }

  filterObjectByValue = (obj, predicate) => {
    return Object.keys(obj)
      .filter(key => predicate(obj[key]))
      .reduce((res, key) => (res[key] = obj[key], res), {})
  }

  render() {
    const { options, returnValue, display } = this.props;
    // const list = this.state.searchText ? this.filterObjectByValue(options, option => option.toLowerCase().includes(this.state.searchText)) : options
    const list = options;
    var labels = [];
    var values = []

    for (var a in list) {
      if (!this.state.searchText ||
        (typeof (list[a]) != 'string' && list[a][display].toLowerCase().includes(this.state.searchText))
        || (typeof (list[a]) == 'string' && list[a].toLowerCase().includes(this.state.searchText))) {
        if (typeof (list[a]) == 'string') {
          labels.push(list[a])
          values.push(list[a])
        } else {
          labels.push(list[a][display])
          values.push(list[a][returnValue])
        }

      }

      // values = Object.keys(list)
    }
    // const labels = Object.keys(list).map(i => list[i])
    // const values = Object.keys(list)
    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={true} >
                <View style={{ backgroundColor: "rgba(12, 12, 12, .5)", alignItems: "center", justifyContent: "center", flex: 1 }}>
                <View style={{ backgroundColor: "white", margin: 30, borderRadius: 10, alignSelf: "stretch" }}>
                <View style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10 }}>
        {this.props.search && <View style={{ flexDirection: 'row', height: 55 }}>
          <View style={{ marginTop: 15, marginLeft: 15, backgroundColor: 'transparent' }}>
            <Icon name="search" type="font-awesome" color={this.props.iconColor} size={20} />
          </View>
          <TextInput
            style={{
              flex:1,
              height: 35,
              margin: 0,
              marginTop: 10,
              marginLeft: -30,
              padding: 5,
              paddingLeft: 30,
              borderColor: this.props.iconColor,
              borderWidth: 1,
              borderRadius: 5
            }}
            onChangeText={(text) => { this._onSearch(text) }}
            clearButtonMode={'always'}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.placeholderTextColor}
            underlineColorAndroid={'transparent'}
          />
        </View>}
        <ScrollView
          style={{ padding: 5, height: this.props.scrollViewHeight }}
        >
          {labels.map((label, index) => {
            const itemKey = returnValue == "label" ? label : values[index]
            return (
              <TouchableOpacity
                key={Math.round(Math.random() * 1000000)}
                style={{
                  padding: 7,
                  marginTop: 0,
                  marginLeft: 2,
                  marginRight: 2,
                  marginBottom: 6,
                  backgroundColor: this.props.rowBackgroundColor,
                  height: this.props.rowHeight,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: this.props.rowRadius
                }}
                onPress={() => {
                  this._onSelect(itemKey)
                }}
              >
                <Text>{label}</Text>
                {

                  this._isSelected(itemKey) ?
                    <Icon name={'check-circle-o'} type="font-awesome"  color={this.props.iconColor} size={this.props.iconSize} />
                    :
                    <Icon name={'circle-o'}  type="font-awesome"   color={this.props.iconColor} size={this.props.iconSize} />
                }
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <View>
          <Button title="Done" onPress={() => {
            this.props.onDone()
          }} />
        </View>
        </View>
        </View>
      </View>
      </Modal>
    );
  }
}
