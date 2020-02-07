import React from 'react';
import { ScrollView, StyleSheet, Picker, View, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { Tab, Tabs, TabHeading, Spinner, Container, Header, Content, Form, Item, Switch, Input, Label, Button, Text, ScrollableTab, Toast, ListItem, List, Left, Body, Right, Separator } from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import API from "../api/entity-save";
import { AsyncStorage } from 'react-native';

import KeyboardShift from '../utils/KeyboardShift'

import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';
import { number, object } from 'prop-types';
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
      isLoading: false,
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
      parent: undefined,
      selectting: undefined
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
    title: navigation.getParam('Title'),
    headerStyle: {
      backgroundColor: '#352e4a',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <View style={{
        flex: 1,
        flexDirection: 'row'
      }}>

        {navigation.getParam("system_tables") && navigation.getParam("system_tables").permission && navigation.getParam("system_tables").permission.write == true &&
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
            type="font-awesome"
            color="#fff"

            name="check"
          />
        }
        <Text>  </Text>
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
          type="font-awesome"
          name="refresh"
          color="#fff"

        />
        <Text>  </Text>
        <Icon
          onPress={() => {
            try {

              navigation.navigate('ChatScreen', {
                'chat': undefined,
                "Title": navigation.getParam('Title'),
                entityId: navigation.getParam("entity")._id,
                entityClass: navigation.getParam("system_tables")._id


              })
            } catch (e) {
              console.log(e)
            }

          }}
          style={{
            flex: 1,
            margin: 8,
          }}
          type="font-awesome"
          color="#fff"

          name="comments"
        />
      </View>
    ),
    headerLeft: () => (
      <View style={{
        flex: 1,
        flexDirection: 'row',
      }}>
        <Icon
          onPress={() => { navigation.goBack() }}
          style={{
            flex: 1,
            margin: 8,
          }}
          type="font-awesome"
          color="#fff"
          name="arrow-left"
        />
        <Text>  </Text>
        <Icon
          onPress={() => { navigation.goBack() }}
          style={{
            flex: 1,
            margin: 8,
          }}
          type="font-awesome"
          color="#fff"
          paddingLeft="10"
          name={navigation.getParam('TitleIcon') + ""}
        />
      </View>
    ),
  });
  async saveEntity() {
    await this.setState({ isLoading: true })
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
    await this.setState({ isLoading: false })
  }
  componentDidMount() {


    //console.log(cityCountryList)
    const { navigation } = this.props
    var system_table = navigation.getParam("system_tables");
    var entity = navigation.getParam("entity");
    var parent = navigation.getParam("parent");
    var tabs = {};
    var tabH = [];
    var collape = {}
    var tab = "Default"
    system_table.columns.map((col, index) => {
      if (index == 0 && col.type != "Section") {
        tabH.push(tab)
        tabs[tab] = []
        collape[tab] = true
      }
      if (col.type == "Section") {
        tab = col.displayName;
        tabH.push(tab)
        tabs[tab] = []
        collape[tab] = true
      }
      if (col.type != "Section") {
        tabs[tab].push(col)
      }

    });
    this.setState({
      system_table: system_table,
      entity: entity,
      parent: parent,
      tabs: tabs,
      tabH: tabH,
      collape: collape
    })
    navigation.setParams({
      saveEntity: this.saveEntity,
      refreshData: this.refreshData,

    })
    this.refreshData();
    //this.props.fetchEntities("system_tables");
  }
  async refreshData() {
    var user = await AsyncStorage.getItem("User");

    await this.setState({ isLoading: true })
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
    await this.setState({ isLoading: false, user: JSON.parse(user) })
  }
  async getDependendData(col) {

    if (col.type == "ObjectId" || col.type == "MultiObject") {
      const token = await AsyncStorage.getItem('userToken')
      var a = await API.FetchEntity(token, "system_tables", col.targetClass);
      a = await a.json()
      var params = {};
      if (this.state.parent._id) {
        params['parent_id'] = this.state.parent._id
      }
      if (col.condition) {

        const con = JSON.parse(col.condition);
        for (i in con) {
          console.log(con[i])
          if (typeof (con[i]) == "object") {
            params[i] = encodeURI(JSON.stringify(con[i]));
          } else {
            params[i] = encodeURI(con[i]);
          }
          // params[i]= JSON.stringify(con[i]);
        }
      }
      b = await API.FetchEntities(token, a.name, params);
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
      return "    ";
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
    const columnPermissions = system_table.columnPermissions;

    var { data } = this.state;
    if (system_table) {


      const rows = system_table;
      return (
        <KeyboardShift>
          {() => (
            <Container style={styles.container}>
              <Content>
                {this.state.user && this.state.user.userType == "SuperAdmin" && data['userType'] != "SuperAdmin" && <Item >
                  <Body style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}><Text>is Super Admin</Text>

                    <Switch style={{ position: "absolute", right: 0 }}
                      text={'value.displayName'}
                      value={data['userType'] == 'CompanyAdmin'}
                      onValueChange={(e) => {
                        if (e) {
                          data['userType'] = 'CompanyAdmin';
                        } else {
                          data['userType'] = null;
                        }
                        this.setState({ data: data })
                      }} />

                  </Body>
                </Item>
                }
                {this.state.tabH.map((tab, ti) => <View>
                  <Header style={{ alignItems: "center", justifyContent: "center", marginBottom: 20 }} >
                    <Label style={{ color: "white", fontSize: 20, flex: 1 }} >{tab}</Label>
                    <Icon style={{ position: "absolute", left: 0 }}
                      color="white" type="font-awesome"
                      name={this.state.collape[tab] == false ? "plus-circle" : "minus-circle"}
                      onPress={() => {
                        this.state.collape[tab] = !this.state.collape[tab];
                        this.setState({ collape: this.state.collape });
                      }}
                    ></Icon></Header>



                  {
                    this.state.collape[tab] == true && this.state.tabs[tab].map((value, index) => {
                      if (columnPermissions[value.name].read != true && columnPermissions[value.name].write != true) {
                        return <View></View>
                      }
                      if (data[value.name] && value.type != "Boolean" && value.type != "Address") {
                        data[value.name] = data[value.name] + "";
                      }
                      if (!data[value.name] && value.type == "Address") {

                        data[value.name] = {};
                      }
                      if (value.type == "Boolean") {
                        return <Item >
                          <Body style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}><Text>{value.displayName}</Text>

                            <Switch style={{ position: "absolute", right: 0 }}
                              text={value.displayName}
                              value={data[value.name]}
                              disabled={columnPermissions[value.name].write != true}
                              onValueChange={(e) => {

                                data[value.name] = e; this.setState({ data: data })
                              }} />

                          </Body>
                        </Item>
                      } else if (value.type == "Integer") {
                        return <Item floatingLabel style={{ padding: 10 }}>
                          <Label>{value.displayName}</Label>
                          <Input
                            keyboardType={'numeric'}
                            style={styles.input}
                            disabled={false}
                            label={value.displayName}
                            value={data[value.name]}
                            disabled={columnPermissions[value.name].write != true}
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
                        </Item>
                      }
                      else if (value.type == "Double") {
                        return <Item floatingLabel style={{ padding: 10 }}>
                          <Label>{value.displayName}</Label>
                          <Input
                            keyboardType={'decimal-pad'}
                            disabled={columnPermissions[value.name].write != true}
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
                        </Item>
                      }
                      else if (value.type == "Long") {
                        return <Item floatingLabel style={{ padding: 10 }}>
                          <Label>{value.displayName}</Label>
                          <Input
                            keyboardType={'numeric'}
                            disabled={columnPermissions[value.name].write != true}
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
                        </Item>

                      }
                      else if (value.type == "String") {
                        return <Item floatingLabel style={{ padding: 10 }}>
                          <Label>{value.displayName}</Label>
                          <Input
                            keyboardType={'default'}
                            style={styles.input}
                            disabled={columnPermissions[value.name].write != true}
                            label={value.displayName}
                            value={data[value.name]}
                            onChangeText={(e) => {

                              data[value.name] = e; this.setState({ data: data })
                            }}
                          />
                        </Item>
                      }
                      else if (value.type == "Password") {
                        return <Item floatingLabel style={{ padding: 10 }}>
                          <Label>{value.displayName}</Label>
                          <Input
                            secureTextEntry
                            keyboardType={'default'}
                            style={styles.input}
                            disabled={columnPermissions[value.name].write != true}
                            type="password"
                            label={value.displayName}
                            value={data[value.name]}
                            onChangeText={(e) => { data[value.name] = e; this.setState({ data: data }) }}
                          />
                        </Item>

                      }
                      else if (value.type == "Select") {
                        return <Item><View style={styles.border}  >
                          <TouchableHighlight style={{ flex: 1 }} onPress={() => {
                            if (columnPermissions[value.name].write != true) {
                              return;
                            }
                            this.setState({
                              customPicker: (ti*10+index)
                            })
                          }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text>{value.displayName} : </Text>
                              <Text >{data[value.name]}</Text>
                            </View>
                          </TouchableHighlight>
                          {this.state.customPicker ==  (ti*10+index) && this.state.isloaed && <CustomPicker
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
                        </View></Item>
                      }
                      else if (value.type == "MultiObject") {
                        return <Item><View style={styles.border}>
                          <TouchableHighlight onPress={() => {
                            if (columnPermissions[value.name].write != true) {
                              return;
                            }
                            this.setState({
                              customPicker:  (ti*10+index)
                            })
                          }}>
                            <View style={{ flexDirection: 'row' }} >
                              <Text>{value.displayName} : </Text>
                              <Text >{this.GetDisplayValue(data, value)}</Text>
                            </View>
                          </TouchableHighlight>
                          {this.state.customPicker ==  (ti*10+index) && this.state.dependencyData[value.targetClass] && <CustomPicker
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
                        </View></Item>
                      } else if (value.type == "MultiSelect") {
                        return <Item><View style={styles.border}   >
                          <TouchableHighlight onPress={() => {
                            if (columnPermissions[value.name].write != true) {
                              return;
                            }

                            this.setState({
                              customPicker:  (ti*10+index)
                            })
                          }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text>{value.displayName} : </Text>
                              <Text>{data[value.name]}</Text>
                            </View>
                          </TouchableHighlight>
                          {this.state.isloaed && this.state.customPicker ==  (ti*10+index) && <CustomPicker
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
                        </View></Item>
                      }
                      else if (value.type == "ObjectId") {
                        return <Item style={{ padding: 15 }} >
                          <TouchableHighlight onPress={() => {
                            if (columnPermissions[value.name].write != true) {
                              return;
                            }

                            this.setState({
                              customPicker:  (ti*10+index)
                            })
                          }} >
                            <View style={{ flexDirection: 'row' }}>
                              <Text>{value.displayName} : </Text>
                              <Text >{this.GetDisplayValue(data, value)}</Text>
                            </View>
                          </TouchableHighlight>
                          {this.state.customPicker ==  (ti*10+index) && this.state.dependencyData[value.targetClass] && <CustomPicker
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

                        </Item>
                      } else if (value.type == "Date") {
                        return <Item style={{ flexDirection: "row" }}>
                          <View style={{ flexDirection: "column" }}>
                            <Label >{value.displayName}</Label>

                            <Text>{data[value.name] ? new Date(data[value.name]).toLocaleString() : ""}</Text>
                          </View>
                          {columnPermissions[value.name].write != true && <View style={{ position: "absolute", right: 0, flexDirection: "row" }}>
                            <Icon
                              type="font-awesome"
                              name="calendar"
                              onPress={(e) => {

                                this.setState({
                                  showDateTimePicker:  (ti*10+index),
                                  mode: 'date'
                                }
                                )
                              }} />

                            <Icon
                              type="material-community"
                              name="clock"
                              onPress={(e) => {
                                this.setState({
                                  showDateTimePicker:  (ti*10+index),
                                  mode: 'time'
                                }
                                )
                              }} />
                          </View>
                          }



                          {this.state.showDateTimePicker && this.state.showDateTimePicker ==  (ti*10+index) &&
                            <DateTimePicker value={data[value.name] ? new Date(data[value.name]) : new Date()}
                              mode={this.state.mode}
                              is24Hour={true}
                              display="default"
                              onChange={(e, date) => {

                                data[value.name] = date; this.setState({ data: data, showDateTimePicker: -1 })
                              }} />
                          }
                        </Item>
                      } else if (value.type == "Address") {
                        return <View>

                          <ListItem itemDivider>
                            <Text>{value.displayName}</Text>
                          </ListItem>

                          <Item floatingLabel style={{ padding: 10 }}>
                            <Label>{'Line 1'}</Label>
                            <Input
                              keyboardType={'default'}
                              
                              style={styles.input}
                              disabled={columnPermissions[value.name].write != true}
                              type="text"
                              label={'Line 1'}
                              value={data[value.name]['Line1']}
                              onChangeText={(e) => { data[value.name]['Line1'] = e; this.setState({ data: data }) }}
                            />
                          </Item>

                          <Item floatingLabel style={{ padding: 10 }}>
                            <Label>{'Line 2'}</Label>
                            <Input
                              keyboardType={'default'}
                              style={styles.input}
                              disabled={columnPermissions[value.name].write != true}
                              type="text"
                              label={'Line 2'}
                              value={data[value.name]['Line2']}
                              onChangeText={(e) => { data[value.name]['Line2'] = e; this.setState({ data: data }) }}
                            />
                          </Item>

                          <Item floatingLabel style={{ padding: 10 }}>
                            <Label>{'City'}</Label>
                            <Input

                              keyboardType={'default'}
                              style={styles.input}
                              disabled={columnPermissions[value.name].write != true}
                              type="text"
                              label={'City'}
                              value={data[value.name]['City']}
                              onChangeText={(e) => { data[value.name]['City'] = e; this.setState({ data: data }) }}
                            />
                          </Item>

                          <Item floatingLabel style={{ padding: 10 }}>
                            <Label>{'State'}</Label>
                            <Input

                              keyboardType={'default'}
                              style={styles.input}
                              disabled={columnPermissions[value.name].write != true}
                              type="text"
                              label={'State'}
                              value={data[value.name]['State']}
                              onChangeText={(e) => { data[value.name]['State'] = e; this.setState({ data: data }) }}
                            />
                          </Item>
                          <Item floatingLabel style={{ padding: 10 }}>
                            <Label>{'Country'}</Label>
                            <Input

                              keyboardType={'default'}
                              style={styles.input}
                              disabled={columnPermissions[value.name].write != true}
                              type="text"
                              label={'Country'}
                              value={data[value.name]['Country']}
                              onChangeText={(e) => { data[value.name]['Country'] = e; this.setState({ data: data }) }}


                            />
                          </Item>

                          {/*                      
                        {this.state.customPicker == index &&  <CustomPicker
                          options={cityCountryList.cityCountryList}

                          selectedValue={data[value.name][ 'Country' ]}
                          display={"name"}
                          search={true} // should show search bar?
                          multiple={false} //
                          style={styles.input}
                          selected={data[value.name]}
                          selectedIconName={"ios-checkmark-circle"}
                          unselectedIconName={"ios-checkmark-circle-outline"}
                          returnValue={"name"}
                          callback={(itemValue) => {

                            try {
                              for (var i in itemValue) {

                                if (typeof (itemValue[i]) == "undefined") {

                                  itemValue.splice(i, 1)
                                }
                              }
                              
                              data[value.name][ 'Country' ] = itemValue[0];; this.setState({ data: data }) 
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
                        </CustomPicker>} */}

                          <FloatingLabelInput

                            keyboardType={'default'}
                            style={styles.input}
                            disabled={columnPermissions[value.name].write != true}
                            type="text"
                            label={'Zip Code'}
                            value={data[value.name]['ZipCode']}
                            onChangeText={(e) => { data[value.name]['ZipCode'] = e; this.setState({ data: data }) }}
                          />
                          <Item floatingLabel style={{ padding: 10 }}>
                            <Label>{'Zip Code'}</Label>
                            <Input

                              keyboardType={'default'}
                              style={styles.input}
                              disabled={columnPermissions[value.name].write != true} 
                              type="text"
                              label={'Zip Code'}
                              value={data[value.name]['ZipCode']}
                              onChangeText={(e) => { data[value.name]['ZipCode'] = e; this.setState({ data: data }) }}

                            />
                          </Item>

                          <Separator bordered>
                            <Text></Text>
                          </Separator>
                        </View>
                      } else if (value.type == "Section") {
                        return <Separator bordered>
                          <Text>{value.displayName}</Text>
                        </Separator>
                      }
                      else {
                        return <View>
                          <Text>{value.displayName}</Text>
                        </View>
                      }
                    })
                  }

                </View>)}

              </Content>
              {this.state.isLoading && <View style={{
                backgroundColor: "rgba(12, 12, 12, .5)",
                position: "absolute", alignItems: "center", justifyContent: "center", flex: 1, width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
              }}><Spinner color='blue' /></View>}

            </Container>
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