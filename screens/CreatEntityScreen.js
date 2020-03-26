import React from 'react';
import { ScrollView, StyleSheet, Picker, View, TouchableOpacity, TouchableHighlight, Dimensions, Modal } from 'react-native';
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
    this.saveEntity = this.saveEntity.bind(this)
    this.getDependendData = this.getDependendData.bind(this)
    this.refreshData = this.refreshData.bind(this)
    this.GetDisplayValue = this.GetDisplayValue.bind(this)
    this.renderView = this.renderView.bind(this)
    this.setDataValue = this.setDataValue.bind(this)
  }

  setDataValue(val, key, nestedMap) {
    var { data } = this.state;

    if (nestedMap.length == 0) {
      data[key] = val
    } else {
      for (i in nestedMap) {
        data[nestedMap[i]][key] = val
      }
    }
    this.setState({ data: data })
  }
  componentWillReceiveProps(nextProps) {


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
    console.log("save entity")
    var { data } = this.state
    await this.setState({ isLoading: true })
    if (this.state.parent) {
      this.state.data.parent_id = this.state.parent._id;
    }
    const token = await AsyncStorage.getItem('userToken');
    var responseJson = await API.EntitySave(token, this.state.system_table.name, this.state.data)
    if (responseJson.status == 200) {
      var json = await responseJson.json();

      this.setState({ data: json, loading: false })


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
    collape[system_table.name] = {}
    var link = {};
    var tab = "Default"
    system_table.columns.map((col, index) => {
      if (index == 0 && col.type != "Section") {
        tabH.push(tab)
        tabs[tab] = []
        collape[system_table.name][tab] = true
      }
      if (col.type == "Section") {
        tab = col.displayName;
        tabH.push(tab)
        tabs[tab] = []
        collape[system_table.name][tab] = true
      }
      if (col.type != "Section") {
        tabs[tab].push(col)
      }
      if (col.type == "Link") {
        var lTab = "Default"
        var lTabs = {};
        var lTabH = [];
        var lCollape = {}
        lCollape[col.table.name] = {}
        col.table.columns.map((lCol, lIndex) => {
          if (lIndex == 0 && lCol.type != "Section") {
            lTabH.push(lTab)
            lTabs[lTab] = []
            lCollape[col.table.name][lTab] = true
          }
          if (lCol.type == "Section") {
            lTab = lCol.displayName;
            lTabH.push(lTab)
            lTabs[lTab] = []
            lCollape[col.table.name][lTab] = true
          }
          if (lCol.type != "Section") {
            lTabs[lTab].push(lCol)
          }
        });
        col.table.tabData = {
          // tab:lTab,
          tabH: lTabH,
          tabs: lTabs,
          collape: lCollape
        }

      }

    });
    system_table.tabData = {
      tabs: tabs,
      tabH: tabH,
      collape: collape
    }
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
      var query = {};

      if (this.state.parent._id) {
        query = { "parent_id": { "$oid": this.state.parent._id } };
      }




      var sort = { 'updateAt': 'desc' };
      sort = encodeURI(JSON.stringify(sort));

      query = encodeURI(JSON.stringify(query))
      var params = { "query": query, "sort": sort }
      var b = await API.FetchEntities(token, a.name, params);
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
  styles = StyleSheet.create({
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
  render() {
    const styles = this.styles;


    const { system_table } = this.state;
    const columnPermissions = system_table.columnPermissions;
    var { data } = this.state;


    if (system_table && system_table.tabData) {
      const { tabH, collape, tabs } = system_table.tabData;
      return (
        <KeyboardShift>
          {() => (
            <Container style={styles.container}>
              <Content>
                {
                  /*     this.state.user && this.state.user.userType == "SuperAdmin" && data['userType'] != "SuperAdmin" && <Item >
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
                     </Item> */
                }
                {this.renderView(system_table, data, [])}

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
  renderView(system_table, dataObject, nestedMap) {

    const styles = this.styles;
    const columnPermissions = system_table.columnPermissions;
    var data = this.state.data;
    if (system_table && system_table.tabData) {
      const { tabH, collape, tabs } = system_table.tabData;
      return (
        <View>
          {tabH.map((tab, ti) => <View>
            <Header style={{ alignItems: "center", justifyContent: "center", marginBottom: 20 }} >
              <Label style={{ color: "white", fontSize: 20, flex: 1 }} >{tab}</Label>
              <Icon style={{ position: "absolute", left: 0 }}
                color="white" type="font-awesome"
                name={collape[system_table.name][tab] == false ? "plus-circle" : "minus-circle"}
                onPress={() => {
                  collape[system_table.name][tab] = !collape[system_table.name][tab];
                  this.setState({ collape: collape });
                }}
              ></Icon></Header>
            {
              collape[system_table.name][tab] == true && tabs[tab].map((value, index) => {

                if (columnPermissions[value.name].read != true && columnPermissions[value.name].write != true) {
                  return <View></View>
                }
                if (dataObject[value.name] && value.type != "Boolean" && value.type != "Address" && value.type != "Link") {
                  dataObject[value.name] = dataObject[value.name] + "";
                }
                if (!dataObject[value.name] && value.type == "Address") {

                  dataObject[value.name] = {};
                }
                if (value.type == "Boolean") {
                  return <Item style={{padding:10}} >
                    <Body style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}><Text>{value.displayName}</Text>

                      <Switch style={{ position: "absolute", right: 0 }}
                        text={value.displayName}
                        value={dataObject[value.name]}
                        disabled={columnPermissions[value.name].write != true}
                        onValueChange={(e) => {

                          dataObject[value.name] = e;
                          this.setDataValue(e, value.name, nestedMap);
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
                      value={dataObject[value.name]}
                      disabled={columnPermissions[value.name].write != true}
                      onChangeText={(e) => {

                        if (e == "") {
                          dataObject[value.name] = ""
                        }
                        else if (isNaN(parseInt(e))) {
                          dataObject[value.name] = ""
                        } else {
                          dataObject[value.name] = parseInt(e) + "";
                          (e[e.length - 1] == '.' && dataObject[value.name].indexOf('.') == -1 ? dataObject[value.name] = dataObject[value.name] + '.' : dataObject[value.name] = dataObject[value.name])
                        }
                        this.setDataValue(dataObject[value.name], value.name, nestedMap);

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
                      value={dataObject[value.name]}
                      onChangeText={(e) => {

                        if (e == "") {
                          dataObject[value.name] = ""
                        }
                        else if (isNaN(parseFloat(e))) {
                          dataObject[value.name] = ""
                        } else {
                          dataObject[value.name] = parseFloat(e) + "";
                          (e[e.length - 1] == '.' && dataObject[value.name].indexOf('.') == -1 ? dataObject[value.name] = dataObject[value.name] + '.' : dataObject[value.name] = dataObject[value.name])
                        }
                        this.setDataValue(dataObject[value.name], value.name, nestedMap);
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
                      value={dataObject[value.name]}
                      onChangeText={(e) => {

                        if (e == "") {
                          dataObject[value.name] = ""
                        }
                        else if (isNaN(parseInt(e))) {
                          dataObject[value.name] = ""
                        } else {
                          dataObject[value.name] = parseInt(e) + "";
                          (e[e.length - 1] == '.' && dataObject[value.name].indexOf('.') == -1 ? dataObject[value.name] = dataObject[value.name] + '.' : dataObject[value.name] = dataObject[value.name])
                        }
                        this.setDataValue(dataObject[value.name], value.name, nestedMap);
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
                      value={dataObject[value.name]}
                      onChangeText={(e) => {
                        dataObject[value.name] = e;
                        this.setDataValue(dataObject[value.name], value.name, nestedMap);
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
                      value={dataObject[value.name]}
                      onChangeText={(e) => {
                        dataObject[value.name] = e;
                        this.setDataValue(dataObject[value.name], value.name, nestedMap);
                      }}
                    />
                  </Item>

                }
                else if (value.type == "Select") {
                  return <Item style={{ }}><View style={styles.border,{flex:1}}  >
                    <TouchableHighlight style={{ flex: 1 }} onPress={() => {
                      if (columnPermissions[value.name].write != true) {
                        return;
                      }
                      this.setState({
                        customPicker: (ti * 10 + index)
                      })
                    }}>
                      <View style={{ flexDirection: 'row',padding:20 }}>
                        <Text>{value.displayName} : </Text>
                        <Text >{dataObject[value.name]}</Text>
                      </View>
                    </TouchableHighlight>
                    {this.state.customPicker == (ti * 10 + index) && this.state.isloaed && <CustomPicker
                      options={value.options}

                      selectedValue={dataObject[value.name]}
                      display={"value"}
                      search={true} // should show search bar?
                      multiple={false} //
                      style={styles.input}
                      selected={dataObject[value.name]}
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
                          dataObject[value.name] = itemValue[0]; this.setDataValue(dataObject[value.name], value.name, nestedMap);
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
                        customPicker: (ti * 10 + index)
                      })
                    }}>
                      <View style={{ flexDirection: 'row' }} >
                        <Text>{value.displayName} : </Text>
                        <Text >{this.GetDisplayValue(dataObject, value)}</Text>
                      </View>
                    </TouchableHighlight>
                    {this.state.customPicker == (ti * 10 + index) && this.state.dependencyData[value.targetClass] && <CustomPicker
                      options={this.state.dependencyData[value.targetClass]}

                      selectedValue={dataObject[value.name]}
                      display={this.state.dependencyTable[value.targetClass] ? this.state.dependencyTable[value.targetClass].name : ""}
                      search={true} // should show search bar?
                      multiple={true} //
                      style={styles.input}
                      selected={dataObject[value.name] ? dataObject[value.name].split(",") : []}
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
                          dataObject[value.name] = itemValue; this.setDataValue(dataObject[value.name], value.name, nestedMap);
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
                        customPicker: (ti * 10 + index)
                      })
                    }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text>{value.displayName} : </Text>
                        <Text>{dataObject[value.name]}</Text>
                      </View>
                    </TouchableHighlight>
                    {this.state.isloaed && this.state.customPicker == (ti * 10 + index) && <CustomPicker
                      options={value.options}

                      selectedValue={dataObject[value.name]}
                      display={"value"}
                      search={true} // should show search bar?
                      multiple={true} //
                      style={styles.input}
                      selected={dataObject[value.name] ? dataObject[value.name].split(",") : []}
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
                          dataObject[value.name] = itemValue; this.setDataValue(dataObject[value.name], value.name, nestedMap);
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
                  return <Item  >
                    <View style={{flex:1}}>
                    <TouchableHighlight onPress={() => {
                      if (columnPermissions[value.name].write != true) {
                        return;
                      }

                      this.setState({
                        customPicker: (ti * 10 + index)
                      })
                    }} >
                      <View style={{ flexDirection: 'row',flex:1,padding:20 }}>
                        <Text>{value.displayName} : </Text>
                        <Text >{this.GetDisplayValue(dataObject, value)}</Text>
                      </View>
                    </TouchableHighlight>
                    </View>
                    {this.state.customPicker == (ti * 10 + index) && this.state.dependencyData[value.targetClass] && <CustomPicker
                      options={this.state.dependencyData[value.targetClass]}

                      selectedValue={dataObject[value.name]}
                      display={this.state.dependencyTable[value.targetClass] ? this.state.dependencyTable[value.targetClass].name : ""}
                      search={true} // should show search bar?
                      multiple={false} //
                      style={styles.input}
                      selected={dataObject[value.name]}
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
                          dataObject[value.name] = itemValue[0]; this.setDataValue(dataObject[value.name], value.name, nestedMap);
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
                  return <Item style={{ flexDirection: "row",padding:10 }}>
                    <View style={{ flexDirection: "column" }}>
                      <Label >{value.displayName}</Label>
                      <Text style={{padding:15}}>{dataObject[value.name] ? new Date(dataObject[value.name]).toLocaleString() : ""}</Text>
                    </View>
                    {columnPermissions[value.name].write == true && <View style={{ position: "absolute", right: 0, flexDirection: "row" , padding:5}}>
                      <Icon
                        type="font-awesome"
                        name="calendar"
                       
                        onPress={(e) => {

                          this.setState({
                            showDateTimePicker: (ti * 10 + index),
                            mode: 'date'
                          }
                          )
                        }} />

                      <Icon
                        type="material-community"
                        name="clock"
                        onPress={(e) => {
                          this.setState({
                            showDateTimePicker: (ti * 10 + index),
                            mode: 'time'
                          }
                          )
                        }} />
                    </View>
                    }



                    {this.state.showDateTimePicker && this.state.showDateTimePicker == (ti * 10 + index) &&
                      <Modal
                        transparent={true}
                        visible={true}
                        presentationStyle="overFullScreen"
                        backgroundColor={"grey"}
                      >
                        <View style={{ backgroundColor: "rgba(12, 12, 12, .9)", justifyContent: "center", flex: 1, }}>
                          <View style={{ backgroundColor: "white",paddingTop:15,borderRadius:5,margin:10}}>
                          <DateTimePicker  value={dataObject[value.name] ? new Date(dataObject[value.name]) : new Date()}
                            mode={this.state.mode}
                            is24Hour={true}
                            display="default"
                            onChange={(e, date) => {

                              dataObject[value.name] = date;
                              this.setState({ data: data })
                              this.setDataValue(dataObject[value.name], value.name, nestedMap);
                            }} />
                            
                          <Button style={{justifyContent: "center" }} onPress={()=>this.setState({showDateTimePicker: -1})} ><Text >Ok</Text></Button>
                          </View>
                        </View>
                      </Modal>
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
                        value={dataObject[value.name]['Line1']}
                        onChangeText={(e) => {
                          dataObject[value.name]['Line1'] = e; this.setDataValue(dataObject[value.name], value.name, nestedMap);
                        }}
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
                        value={dataObject[value.name]['Line2']}
                        onChangeText={(e) => {
                          dataObject[value.name]['Line2'] = e; this.setDataValue(dataObject[value.name], value.name, nestedMap);
                        }}
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
                        value={dataObject[value.name]['City']}
                        onChangeText={(e) => {
                          dataObject[value.name]['City'] = e; this.setDataValue(dataObject[value.name], value.name, nestedMap);
                        }}
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
                        value={dataObject[value.name]['State']}
                        onChangeText={(e) => {
                          dataObject[value.name]['State'] = e; this.setDataValue(dataObject[value.name], value.name, nestedMap);
                        }}
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
                        value={dataObject[value.name]['Country']}
                        onChangeText={(e) => { dataObject[value.name]['Country'] = e; this.setDataValue(dataObject[value.name], value.name, nestedMap); }}


                      />
                    </Item>

                    <FloatingLabelInput

                      keyboardType={'default'}
                      style={styles.input}
                      disabled={columnPermissions[value.name].write != true}
                      type="text"
                      label={'Zip Code'}
                      value={dataObject[value.name]['ZipCode']}
                      onChangeText={(e) => { dataObject[value.name]['ZipCode'] = e; this.setDataValue(dataObject[value.name], value.name, nestedMap); }}
                    />
                    <Item floatingLabel style={{ padding: 10 }}>
                      <Label>{'Zip Code'}</Label>
                      <Input

                        keyboardType={'default'}
                        style={styles.input}
                        disabled={columnPermissions[value.name].write != true}
                        type="text"
                        label={'Zip Code'}
                        value={dataObject[value.name]['ZipCode']}
                        onChangeText={(e) => {
                          dataObject[value.name]['ZipCode'] = e;
                          this.setState({ data: data })
                        }}

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
                } else if (value.type == "Link") {
                  if (typeof (dataObject[value.name]) == "undefined") {
                    dataObject[value.name] = {}
                  }

                  var m = JSON.parse(JSON.stringify(nestedMap))

                  m.push(value.name)
                  return this.renderView(value.table, dataObject[value.name], m)
                }
                else {
                  return <View>
                    <Text>{value.displayName}</Text>
                  </View>
                }
              })
            }

          </View>)}

        </View>

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