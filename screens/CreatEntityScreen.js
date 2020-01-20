import React from 'react';
import { ScrollView, StyleSheet, Button, Picker, View, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import API from "../api/entity-save";
import { AsyncStorage } from 'react-native';

import KeyboardShift from '../utils/KeyboardShift'

import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';
import { number } from 'prop-types';
import { apisAreAvailable } from 'expo';
import CustomMultiPicker from "react-native-multiple-select-list";
import MultiSelect from 'react-native-multiple-select';
import CustomPicker from "../components/CustomPicker";
import CustomSwitchWithLabel from '../components/CustomSwitchWithLabel';
import FloatingLabelInput from '../components/FloatingLabelInput';
import DateTimePicker from '@react-native-community/datetimepicker';

class CreatEntityScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      dependencyTable: {},
      dependencyData: {},
      dependencyDataMap: {},
      system_table: "",
      styles: StyleSheet.create({
        container: {
          flex: 1,
          paddingTop: 15,
          backgroundColor: '#fff',
        },
        containerLayout: {
          flexDirection: 'row',
        },
        input: {
          flex: 1,
          margin: 8,
        },
      }),
      data: {
        // Integer:""
      },
      parent: undefined
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.addColumn = this.addColumn.bind(this)
    this.saveEntity = this.saveEntity.bind(this)
    this.getDependendData = this.getDependendData.bind(this)
    this.refreshData = this.refreshData.bind(this)
    this.GetDisplayValue = this.GetDisplayValue.bind(this)

  }

  componentWillReceiveProps(nextProps) {

    // if (nextProps.entity) {

    //   this.setState({ data: nextProps.entity })
    // }
    // if (nextProps.systemEntityMap) {
    //   this.setState({ systemEntities: nextProps.systemEntityMap })
    // }
    // if (nextProps.loading) {
    //   this.setState({ loading: nextProps.loading })
    // }

  }

  addColumn() {
    this.state.table.columns.push({ name: "ds", type: 'Boolean', nullValue: false, uniqueValue: true, defaultValue: null, targetClass: null })
    this.setState({ table: this.state.table })
  }



  static navigationOptions = ({ navigation, state, props }) => ({
    title: 'Tables',
    headerRight: () => (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        paddingTop: 15,
        backgroundColor: '#fff'
      }}>


        <Icon
          onPress={() => {
            try {
              navigation.getParam('saveEntity')();
            } catch (e) {

            }

          }}
          style={{
            flex: 1,
            margin: 8,
          }}
          name="check"
        />
        <Icon
          onPress={() => {
            try {
              navigation.getParam('refreshData')();
            } catch (e) {
              console.log(e)
            }

          }}
          style={{
            flex: 1,
            margin: 8,
          }}
          name="refresh"
        />
      </View>
    ),
    headerLeft: () => (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        paddingTop: 15,
        backgroundColor: '#fff'
      }}>
        <Icon
          onPress={() => { navigation.goBack() }}
          style={{
            flex: 1,
            margin: 8,
          }}
          name="keyboard-backspace"
        />

      </View>
    ),
  });
  async saveEntity() {

    if (this.state.parent) {
      this.state.data.parent_id = this.state.parent._id;
    }
    const token = await AsyncStorage.getItem('userToken');
    var responseJson = await API.EntitySave(token, this.state.system_table.name, this.state.data)
    if (responseJson.status == 200) {
      var json = await responseJson.json();
      this.setState({ table: json, loading: false })

     
    } else {

    }

  }
  componentDidMount() {
    debugger
    const { navigation } = this.props
    var system_table = navigation.getParam("system_tables");
    var entity = navigation.getParam("entity");
    var parent = navigation.getParam("parent");

    this.setState({
      system_table: system_table, entity: entity,
      parent: parent
    })
    navigation.setParams({
      saveEntity: this.saveEntity,
      refreshData: this.refreshData,

    })
    this.refreshData();
    //this.props.fetchEntities("system_tables");
  }
  async refreshData() {
    const token = await AsyncStorage.getItem('userToken')
    const { navigation } = this.props
    var system_table = navigation.getParam("system_tables");
    var entity = navigation.getParam("entity");
    if (entity) {
      // this.props.fetchEntity(system_table.name, entity._id);
      var a = await API.FetchEntity(token, system_table.name, entity._id);
      a = await a.json()
      this.setState({ data: a })

    } else if (this.state.data._id) {
      // this.props.fetchEntity(system_table.name, this.state.data._id);
      var a = await API.FetchEntity(token, system_table.name, this.state.data._id);
      a = await a.json()
      this.setState({ data: a })

    } else {
      this.props.clearEntity()
      this.setState({ data: {} })
    }

    system_table.columns.map((col, ind) => {
      if (col.type == "ObjectId" || col.type == "MultiObject") {
        this.getDependendData(col)

      }
    });
    this.setState({ isloaed: true })
  }
  async getDependendData(col) {

    if (col.type == "ObjectId" || col.type == "MultiObject") {
      const token = await AsyncStorage.getItem('userToken')
      var a = await API.FetchEntity(token, "system_tables", col.targetClass);
      a = await a.json()
      b = await API.FetchEntities(token, a.name);
      b = await b.json()
      for (var i in a.columns) {
        if (a.columns[i].dropDownValue == true) {
          this.state.dependencyTable[col.targetClass] = a.columns[i]
        }
      }

      this.state.dependencyData[col.targetClass] = b
      this.state.dependencyDataMap[col.targetClass] = {};
      for (i in b) {
        this.state.dependencyDataMap[col.targetClass][b[i]._id] = b[i];
      }
      this.setState({
        dependencyTable: this.state.dependencyTable,
        dependencyData: this.state.dependencyData,
        dependencyDataMap: this.state.dependencyDataMap
      })
    }
  }

  GetDisplayValue(data, value) {
    if (this.state.dependencyDataMap[value.targetClass] && data[value.name]) {
      
      var a = data[value.name].split(",");
      var b = [];
      for (var i in a) {
        b.push(this.state.dependencyDataMap[value.targetClass][a[i]][this.state.dependencyTable[value.targetClass].name])

      }
      return b.join(",");
    } else {
      return "";
    }
  }
  handleAdd() {
    this.props.navigation.navigate('CreatEntity')
  }
  render() {

    const { table } = this.state;
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
      },
      containerLayout: {
        flexDirection: 'row',
      },
      input: {
        flex: 1,
        margin: 8,
      },
      border: { borderBottomColor: "grey", borderBottomWidth: 1, borderStyle: "solid", margin: 10 }
    });

    const Types = [
      { text: 'Boolean' },
      { text: 'Integer' },
      { text: 'Double' },
      { text: 'Date ' },
      { text: 'Long' },
      { text: 'String' },
      { text: 'ObjectId' },
      { text: 'File' },
    ];
    const { system_table } = this.state;
    var { data } = this.state;
    if (system_table) {


      const rows = system_table;
      return (
        <KeyboardShift>
          {() => (
            <ScrollView style={styles.container}>
              <View>
                {
                  rows.columns.map((value, index) => {
                    if (data[value.name] && value.type != "Boolean") {
                      data[value.name] = data[value.name] + "";
                    }

                    if (value.type == "Boolean") {
                      return <View style={styles.border}>

                        <CustomSwitchWithLabel style={styles.input}
                          text={value.displayName}
                          value={data[value.name]}
                          onValueChange={(e) => {
                            debugger
                            data[value.name] = e; this.setState({ data: data })
                          }}
                        />
                      </View>
                    } else if (value.type == "Integer") {
                      return <View style={styles.border}>

                        <FloatingLabelInput
                          keyboardType={'numeric'}
                          style={styles.input}
                          disabled={false}
                          label={value.displayName}
                          value={data[value.name]}
                          onChangeText={(e) => {

                            if (e == "") {
                              data[value.name] = ""
                            }
                            else if (isNaN(parseInt(e))) {
                              data[value.name] = ""
                            } else {
                              data[value.name] = parseInt(e) + "";
                              (e[e.length - 1] == '.' && data[value.name].indexOf('.') == -1 ? data[value.name] = data[value.name] + '.' : data[value.name] = data[value.name])
                            }
                            this.setState({ data: data })
                          }}
                        />
                      </View>
                    }
                    else if (value.type == "Double") {
                      return <View style={styles.border}>
                        <FloatingLabelInput
                          keyboardType={'decimal-pad'}

                          style={styles.input}
                          disabled={false}
                          label={value.displayName}
                          value={data[value.name]}
                          onChangeText={(e) => {

                            if (e == "") {
                              data[value.name] = ""
                            }
                            else if (isNaN(parseFloat(e))) {
                              data[value.name] = ""
                            } else {
                              data[value.name] = parseFloat(e) + "";
                              (e[e.length - 1] == '.' && data[value.name].indexOf('.') == -1 ? data[value.name] = data[value.name] + '.' : data[value.name] = data[value.name])
                            }
                            this.setState({ data: data })
                          }}
                        />
                      </View>
                    }
                    else if (value.type == "Long") {
                      return <View style={styles.border}>
                        <FloatingLabelInput
                          keyboardType={'numeric'}

                          style={styles.input}
                          disabled={false}
                          label={value.displayName}
                          value={data[value.name]}
                          onChangeText={(e) => {

                            if (e == "") {
                              data[value.name] = ""
                            }
                            else if (isNaN(parseInt(e))) {
                              data[value.name] = ""
                            } else {
                              data[value.name] = parseInt(e) + "";
                              (e[e.length - 1] == '.' && data[value.name].indexOf('.') == -1 ? data[value.name] = data[value.name] + '.' : data[value.name] = data[value.name])
                            }
                            this.setState({ data: data })
                          }}
                        />
                      </View>
                    }
                    else if (value.type == "String") {
                      return <View style={styles.border}>
                        <FloatingLabelInput
                          keyboardType={'default'}
                          style={styles.input}
                          disabled={false}
                          label={value.displayName}
                          value={data[value.name]}
                          onChangeText={(e) => {

                            data[value.name] = e; this.setState({ data: data })
                          }}
                        />
                      </View>
                    }
                    else if (value.type == "Password") {
                      return <View style={styles.border}>
                        <FloatingLabelInput
                          secureTextEntry
                          keyboardType={'default'}
                          style={styles.input}
                          disabled={false}
                          type="password"
                          label={value.displayName}
                          value={data[value.name]}
                          onChangeText={(e) => { data[value.name] = e; this.setState({ data: data }) }}
                        />
                      </View>
                    }
                    else if (value.type == "Select") {
                      return <View style={styles.border}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text>{value.displayName} : </Text>
                          <Text onPress={() => {
                            this.setState({
                              customPicker: index
                            })
                          }}>{data[value.name]}</Text>
                        </View>
                        {this.state.customPicker == index && this.state.isloaed && <CustomPicker
                          options={value.options}

                          selectedValue={data[value.name]}
                          display={"value"}
                          search={true} // should show search bar?
                          multiple={false} //
                          style={styles.input}
                          selected={data[value.name]}
                          selectedIconName={"ios-checkmark-circle"}
                          unselectedIconName={"ios-checkmark-circle-outline"}
                          returnValue={"value"}
                          callback={(itemValue) => {

                            try {
                              for (var i in itemValue) {

                                if (typeof (itemValue[i]) == "undefined") {

                                  itemValue.splice(i, 1)
                                }
                              }
                              data[value.name] = itemValue[0]; this.setState({ data: data })
                            }
                            catch (e) { }
                          }
                          }
                          onDone={(e) => {
                            this.setState({
                              customPicker: -1
                            })
                          }}
                        >
                        </CustomPicker>}
                      </View>
                    }
                    else if (value.type == "MultiObject") {
                      return <View style={styles.border}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text>{value.displayName} : </Text>
                          <Text onPress={() => {
                            this.setState({
                              customPicker: index
                            })
                          }}>{this.GetDisplayValue(data, value)}</Text>
                        </View>
                        {this.state.customPicker == index && this.state.dependencyData[value.targetClass] && <CustomPicker
                          options={this.state.dependencyData[value.targetClass]}

                          selectedValue={data[value.name]}
                          display={this.state.dependencyTable[value.targetClass] ? this.state.dependencyTable[value.targetClass].name : ""}
                          search={true} // should show search bar?
                          multiple={true} //
                          style={styles.input}
                          selected={data[value.name] ? data[value.name].split(",") : []}
                          selectedIconName={"ios-checkmark-circle"}
                          unselectedIconName={"ios-checkmark-circle-outline"}
                          returnValue={"_id"}
                          callback={(itemValue) => {

                            try {
                              for (var i in itemValue) {

                                if (typeof (itemValue[i]) == "undefined") {

                                  itemValue.splice(i, 1)
                                }
                              }
                              data[value.name] = itemValue; this.setState({ data: data })
                            }
                            catch (e) { }
                          }
                          }
                          onDone={(e) => {
                            this.setState({
                              customPicker: -1
                            })
                          }}
                        >
                        </CustomPicker>
                        }
                      </View>
                    } else if (value.type == "MultiSelect") {
                      return <View style={styles.border}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text>{value.displayName} : </Text>
                          <Text onPress={() => {
                            this.setState({
                              customPicker: index
                            })
                          }}>{data[value.name]}</Text>
                        </View>
                        {this.state.isloaed && this.state.customPicker == index && <CustomPicker
                          options={value.options}

                          selectedValue={data[value.name]}
                          display={"value"}
                          search={true} // should show search bar?
                          multiple={true} //
                          style={styles.input}
                          selected={data[value.name] ? data[value.name].split(",") : []}
                          selectedIconName={"ios-checkmark-circle"}
                          unselectedIconName={"ios-checkmark-circle-outline"}
                          returnValue={"value"}
                          callback={(itemValue) => {

                            try {
                              for (var i in itemValue) {

                                if (typeof (itemValue[i]) == "undefined") {

                                  itemValue.splice(i, 1)
                                }
                              }
                              data[value.name] = itemValue; this.setState({ data: data })
                            }
                            catch (e) { }
                          }
                          }

                          onDone={(e) => {
                            this.setState({
                              customPicker: -1
                            })
                          }}>
                        </CustomPicker>}
                      </View>
                    }
                    else if (value.type == "ObjectId") {
                      return <View style={styles.border}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text>{value.displayName} : </Text>
                          <Text onPress={() => {
                            this.setState({
                              customPicker: index
                            })
                          }}>{this.GetDisplayValue(data, value)}</Text>
                        </View>
                        {this.state.customPicker == index && this.state.dependencyData[value.targetClass] && <CustomPicker
                          options={this.state.dependencyData[value.targetClass]}

                          selectedValue={data[value.name]}
                          display={this.state.dependencyTable[value.targetClass] ? this.state.dependencyTable[value.targetClass].name : ""}
                          search={true} // should show search bar?
                          multiple={false} //
                          style={styles.input}
                          selected={data[value.name]}
                          selectedIconName={"ios-checkmark-circle"}
                          unselectedIconName={"ios-checkmark-circle-outline"}
                          returnValue={"_id"}
                          callback={(itemValue) => {

                            try {
                              for (var i in itemValue) {

                                if (typeof (itemValue[i]) == "undefined") {

                                  itemValue.splice(i, 1)
                                }
                              }
                              data[value.name] = itemValue[0]; this.setState({ data: data })
                            }
                            catch (e) { }
                          }
                          }
                          onDone={(e) => {
                            this.setState({
                              customPicker: -1
                            })
                          }}
                        >
                        </CustomPicker>}

                      </View>
                    } else if (value.type == "Date") {
                      return <View style={styles.border}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text>{value.displayName} :  </Text>
                          <Text>{data[value.name]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Button title={"selectDate"} onPress={(e) => {
                            this.setState({
                              showDateTimePicker: index,
                              mode: 'date'
                            }
                            )
                          }}></Button>
                          <Button title={"selectTime"} onPress={(e) => {
                            this.setState({
                              showDateTimePicker: index,
                              mode: 'time'
                            }
                            )
                          }}></Button>
                        </View>

                        {this.state.showDateTimePicker && this.state.showDateTimePicker == index &&
                          <DateTimePicker value={data[value.name] ? new Date(data[value.name]) : new Date()}
                            mode={this.state.mode}
                            is24Hour={true}
                            display="default"
                            onChange={(e, date) => {
                              debugger
                              data[value.name] = date; this.setState({ data: data, showDateTimePicker: -1 })
                            }} />
                        }
                      </View>
                    } else {
                      return <View>
                        <Text>{value.displayName}</Text>
                      </View>
                    }
                  })
                }

              </View>
            </ScrollView>
          )}
        </KeyboardShift>
      );
    } else {
      return <View></View>
    }
  }
}

const mapStateToProps = state => ({
  entity: state.entityReducer.entity,
  loading: state.entityReducer.loading,
  systemEntityMap: state.entityReducer.systemEntityMap
});


const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...entityActions,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(CreatEntityScreen);