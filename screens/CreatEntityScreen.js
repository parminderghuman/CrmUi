import React from 'react';
import { ScrollView, StyleSheet, Button, Picker } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import API from "../api/entity-save";
import { AsyncStorage } from 'react-native';

import {
  Input, Layout, Select, CheckBox, List,
  ListItem, Text
} from '@ui-kitten/components';
import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';
import { number } from 'prop-types';
import { apisAreAvailable } from 'expo';

class CreatEntityScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      dependencyTable: {},
      dependencyData: {},
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
      }
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.addColumn = this.addColumn.bind(this)
    this.saveEntity = this.saveEntity.bind(this)
    this.getDependendData = this.getDependendData.bind(this)
    this.refreshData = this.refreshData.bind(this)

  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.entity) {
      this.setState({ data: nextProps.entity })
    }
    if (nextProps.systemEntityMap) {
      this.setState({ systemEntities: nextProps.systemEntityMap })
    }
    if (nextProps.loading) {
      this.setState({ loading: nextProps.loading })
    }

  }

  addColumn() {
    this.state.table.columns.push({ name: "ds", type: 'Boolean', nullValue: false, uniqueValue: true, defaultValue: null, targetClass: null })
    this.setState({ table: this.state.table })
  }



  static navigationOptions = ({ navigation, state, props }) => ({
    title: 'Tables',
    headerRight: () => (
      <Layout style={{
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
      </Layout>
    ),
    headerLeft: () => (
      <Layout style={{
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

      </Layout>
    ),
  });
  saveEntity() {
    debugger
    this.props.saveEntity(this.state.system_table.name, this.state.data)
    //this.props.navigation.goBack();
  }
  componentDidMount() {
    const { navigation } = this.props
    var system_table = navigation.getParam("system_tables");
    var entity = navigation.getParam("entity");

    this.setState({
      system_table: system_table, entity: entity
    })
    navigation.setParams({
      saveEntity: this.saveEntity,
      refreshData: this.refreshData
    })
    this.refreshData();
    //this.props.fetchEntities("system_tables");
  }
  refreshData() {
    debugger
    const { navigation } = this.props
    var system_table = navigation.getParam("system_tables");
    var entity = navigation.getParam("entity");
    if (entity) {
      this.props.fetchEntity(system_table.name, entity._id);
    } else if (this.state.data._id) {
      this.props.fetchEntity(system_table.name, this.state.data._id);
    } else {
      this.props.clearEntity()
      this.setState({ data: {} })
    }

    system_table.columns.map((col, ind) => {
      if(col.type == "ObjectId"){
        this.getDependendData(col)

      }
    });

  }
  async getDependendData(col) {
    debugger
    if (col.type == "ObjectId") {
      const token = await AsyncStorage.getItem('userToken')
      var a = await API.FetchEntity(token, "system_tables", col.targetClass);
      a = await a.json()
      b = await API.FetchEntities(token, a.name);
      b = await b.json()
      for( var i in a.columns){
        if(a.columns[i].dropDownValue ==  true){
          this.state.dependencyTable[col.targetClass] =a.columns[i]
        }
      }
     
      this.state.dependencyData[col.targetClass] = b
      this.setState({
        dependencyTable: this.state.dependencyTable,
        dependencyData: this.state.dependencyData
      })
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
    const { systemEntities, system_table } = this.state;
    var { data } = this.state;
    if (system_table) {


      const rows = system_table;
      return (
        <ScrollView style={styles.container}>
          <Layout>
            {
              rows.columns.map((value, index) => {
                if (data[value.name] && value.type != "Boolean") {
                  data[value.name] = data[value.name] + "";
                }
                if (value.type == "Boolean") {
                  return <Layout>
                    <Text>{value.displayName}</Text>
                    <CheckBox style={styles.input}
                      text={value.displayName}
                      checked={data[value.name]}
                      onChange={(e) => { data[value.name] = e; this.setState({ data: data }) }}
                    />
                  </Layout>
                } else if (value.type == "Integer") {
                  return <Layout>
                    <Text>{value.displayName}</Text>
                    <Input

                      style={styles.input}
                      disabled={false}
                      placeholder={value.displayName}
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
                  </Layout>
                }
                else if (value.type == "Double") {
                  return <Layout>
                    <Text>{value.displayName}</Text>
                    <Input
                      style={styles.input}
                      disabled={false}
                      placeholder={value.displayName}
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
                  </Layout>
                }
                else if (value.type == "Long") {
                  return <Layout>
                    <Text>{value.displayName}</Text>
                    <Input
                      style={styles.input}
                      disabled={false}
                      placeholder={value.displayName}
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
                  </Layout>
                }
                else if (value.type == "String") {
                  return <Layout>
                    <Text>{value.displayName}</Text>
                    <Input
                      style={styles.input}
                      disabled={false}
                      placeholder={value.displayName}
                      value={data[value.name]}
                      onChangeText={(e) => { data[value.name] = e; this.setState({ data: data }) }}
                    />
                  </Layout>
                }
                else if (value.type == "Password") {
                  return <Layout>
                    <Text>{value.displayName}</Text>
                    <Input
                      style={styles.input}
                      disabled={false}
                      type="password"
                      placeholder={value.displayName}
                      value={data[value.name]}
                      onChangeText={(e) => { data[value.name] = e; this.setState({ data: data }) }}
                    />
                  </Layout>
                }
                else if (value.type == "Select") {
                  return <Layout>
                    <Text>{value.displayName}</Text>
                    <Picker
                      selectedValue={data[value.name]}
                      style={styles.input}
                      onValueChange={(itemValue, itemIndex) => {
                        data[value.name] = itemValue; this.setState({ data: data })
                      }
                      }>
                      {
                        value.options && value.options.map((role, i) =>
                          <Picker.Item label={role} value={role} />
                        )}
                    </Picker>
                  </Layout>
                }
                else if (value.type == "ObjectId") {
                  return <Layout>
                    <Text>{value.displayName}</Text>
                    <Picker
                      selectedValue={data[value.name]}
                      style={styles.input}
                      onValueChange={(itemValue, itemIndex) => {
                        data[value.name] = itemValue; this.setState({ data: data })
                      }
                      }>
                      {
                        
                      this.state.dependencyTable[value.targetClass] &&   this.state.dependencyData[value.targetClass] && this.state.dependencyData[value.targetClass].map((role, i) =>
                          <Picker.Item label={role[this.state.dependencyTable[value.targetClass].name]} value={role._id} />
                        )}
                    </Picker>
                  </Layout>
                }
              })
            }

          </Layout>
        </ScrollView>
      );
    } else {
      return <Layout></Layout>
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