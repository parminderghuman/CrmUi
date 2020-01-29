import React from 'react';
import { ScrollView, StyleSheet, Picker, Text, ActivityIndicator, Modal, View, Switch } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Toast, ListItem, List, Left, Body, Right } from 'native-base';

import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';
import API from "../api/entity-save";
import { AsyncStorage } from 'react-native';
import FloatingLabelInput from '../components/FloatingLabelInput'
import KeyboardShift from '../utils/KeyboardShift'
import CustomSwitchWithLabel from '../components/CustomSwitchWithLabel'

class CreateTableScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      roles: [],
      systemEntities: [],
      isNew: false,
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
      table: {
        id: null,
        name: "",
        icon: '',
        columns: [{ name: "", type: 'Boolean', uniqueValue: false, nullValue: true, defaultValue: null, targetClass: null }],
        permissions: []
      }, loading: false
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.addColumn = this.addColumn.bind(this)
    this.saveEntity = this.saveEntity.bind(this)
    this.addPermission = this.addPermission.bind(this)
    this.fetchEntity = this.fetchEntity.bind(this)

  }

  componentWillReceiveProps(nextProps) {

    if (!this.state.isNew && nextProps.systemEntity) {
      this.setState({ table: nextProps.systemEntity, loading: false })

    }
    if (nextProps.loading) {
      this.setState({ loading: nextProps.loading })
    }
    if (nextProps.roles) {
      this.setState({ roles: nextProps.roles })
    } if (nextProps.systemEntities) {
      this.setState({ systemEntities: nextProps.systemEntities })
    }
  }

  addPermission() {
    if (!this.state.table.permissions) {
      this.state.table.permissions = []
    }
    this.state.table.permissions.push({ name: '', canAdd: true })
    this.setState({ table: this.state.table })
  }

  addColumn() {
    this.state.table.columns.push({ name: "", type: 'Boolean', nullValue: false, uniqueValue: true, defaultValue: null, targetClass: null })
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
            }
            catch (e) {

            }
          }}
          style={{
            flex: 1,
            margin: 10
          }}
          name="check"
        />

        <Icon
          onPress={() => {
            try {
              navigation.getParam('fetchEntity')();
            }
            catch (e) {

            }
          }}
          type="font-awesome"
          style={{
            flex: 1,
            margin: 10,
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

  fetchEntity() {
    const { navigation } = this.props;

    var id = navigation.getParam("id");
    if (id) {
      this.props.fetchSystemEntity("system_tables", id);
    } else {
      this.setState({
        table: {
          id: null,
          name: "",
          icon: '',
          columns: [{ name: "", type: 'Boolean', uniqueValue: false, nullValue: true, defaultValue: null, targetClass: null }],
          permissions: []
        }, loading: false
      })
    }
    this.props.fetchRoles("Role")
  }

  async saveEntity() {
    this.setState({ loading: true })
    this.props.saveSystemEntity("system_tables", this.state.table)
    const token = await AsyncStorage.getItem('userToken')
    var responseJson = await API.EntitySave(token, "system_tables", this.state.table)
    if (responseJson.status == 200) {
      var json = await responseJson.json();
      this.setState({ table: json, loading: false })


    } else {

    }
    //this.props.navigation.goBack();
  }
  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      saveEntity: this.saveEntity,
      fetchEntity: this.fetchEntity
    })
    var id = navigation.getParam("id");
    if (!id) {
      this.setState({ isNew: true, id: id })
    }
    this.setState({ loading: true })
    this.fetchEntity();

  }
  handleAdd() {
    this.props.navigation.navigate('CreateTable')
  }
  render() {

    const { table, loading } = this.state;
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
        width: 'auto'
      },
    });

    const lStyles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        height: 100
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
      }
    })
    return (
      <KeyboardShift>
        {() => (<Container>
          <Content style={styles.container} keyboardShouldPersistTaps='handled' >
            <Form>
              {loading &&
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={true}
                >
                  <View style={[lStyles.container, lStyles.horizontal]}>
                    <ActivityIndicator size="large" color="#000000" />
                  </View>
                </Modal>
              }
              <Item floatingLabel style={{ padding: 10 }}>
                <Label>Name</Label>
                <Input
                  value={table.name}
                  label='Name'
                  onChangeText={(ev) => {

                    table.name = ev; this.setState({ table: table })
                  }}
                />
              </Item> 
              <Item floatingLabel style={{ padding: 10 }}>
                <Label>Display Name</Label>
                <Input
                  value={table.displayName}
                  label='Name'
                  onChangeText={(ev) => {

                    table.displayName = ev; this.setState({ table: table })
                  }}
                />
              </Item>
              <ListItem >
                <Left><Text>Is Alias</Text></Left>
                <Right>
                  <Switch
                    value={table.alias}
                    onValueChange={(e) => { table.alias = e; this.setState({ table: table }) }} />
                </Right>
              </ListItem>

              {table.alias &&
                <Item floatingLabel style={{ padding: 10 }}>
                  <Label>Alias Rules</Label>
                  <Input
                    value={table.aliasRules}
                    label='Alias Rules'
                    onChangeText={(ev) => {

                      table.aliasRules = ev; this.setState({ table: table })
                    }}
                  />
                </Item>
              }
              <Item>
                <Text>Parent Class</Text>
                <Picker
                  label='Parent Class'
                  selectedValue={table.parentClass}
                  style={styles.input}
                  onValueChange={(itemValue, itemIndex) => {
                    table.parentClass = itemValue; this.setState({ table: table })
                  }
                  }>
                  <Picker.Item label={'None'} />
                  {
                    this.state.systemEntities && this.state.systemEntities.map((role, i) =>
                      <Picker.Item label={role.name} value={role._id} />
                    )}
                </Picker>
              </Item>
              <ListItem>
                <Left><Icon
                  style={styles.input}
                  name={table.icon}
                  type="font-awesome"
                /></Left>
                <Body>
                  <Item floatingLabel style={{ padding: 0 }} >

                    <Label>Icon</Label>
                    <Input
                      style={styles.input}
                      disabled={false}
                      label='Icon Name'
                      value={table.icon}
                      onChangeText={(e) => { table.icon = e; this.setState({ table: table }) }}
                    />

                  </Item>
                </Body>
              </ListItem>
              <List>
                <ListItem itemHeader first>
                  <Text></Text>
                </ListItem>
                <ListItem itemDivider>
                  <Text>Fields</Text>
                </ListItem>

                {!table.alias && table.columns.map((name, index) =>

                  <ListItem key={index} style={{ flexDirection: 'column' }}>
                    <Item floatingLabel style={{ padding: 0 }} >

                      <Label>{index}</Label>
                    </Item>

                    <Item floatingLabel style={{ padding: 0 }} >

                      <Label>Name</Label>
                      <Input
                        style={styles.input}
                        disabled={false}
                        label='Name '
                        value={name.name}
                        onChangeText={(e) => { table.columns[index].name = e; this.setState({ table: table }); }}
                      />
                    </Item>
                    <Item floatingLabel style={{ padding: 0 }} >

                      <Label>Display Name</Label>
                      <Input
                        style={styles.input}
                        disabled={false}
                        label='Display Name '
                        value={name.displayName}
                        onChangeText={(e) => { table.columns[index].displayName = e; this.setState({ table: table }) }}

                      />
                    </Item>
                    <Item floatingLabel style={{ padding: 0 }} >

                      <Label>Default Value </Label>
                      <Input
                        style={styles.input}
                        disabled={false}
                        label='Default Value '
                        value={name.defaultValue}
                        onChangeText={(e) => { table.columns[index].defaultValue = e; this.setState({ table: table }) }}

                      />
                    </Item>

                    <Item >
                      <Text>Column Type</Text>
                      <Picker
                        selectedValue={name.type}
                        style={styles.input}
                        onValueChange={(itemValue, itemIndex) => { table.columns[index].type = itemValue; this.setState({ table: table }) }
                        }>
                        <Picker.Item label="Select One" />
                        <Picker.Item label="Boolean" value="Boolean" />
                        <Picker.Item label="Password" value="Password" />

                        <Picker.Item label="Integer" value="Integer" />
                        <Picker.Item label="Double" value="Double" />
                        <Picker.Item label="Date" value="Date" />

                        <Picker.Item label="Long" value="Long" />
                        <Picker.Item label="String" value="String" />
                        <Picker.Item label="ObjectId" value="ObjectId" />
                        <Picker.Item label="File" value="File" />
                        <Picker.Item label="Select" value="Select" />
                        <Picker.Item label="MultiSelect" value="MultiSelect" />
                        <Picker.Item label="MultiObject" value="MultiObject" />
                        <Picker.Item label="Address" value="Address" />
                      </Picker>
                    </Item>




                    {name.type && (name.type == 'Select' || name.type == 'MultiSelect') && name.options && name.options.map((opt, opti) =>
                      <Item floatingLabel style={{ padding: 0 }} >

                        <Label>{'Option ' + opti} </Label>
                        <Input
                          style={styles.input}
                          disabled={false}
                          label={'Option ' + opti}
                          value={opt}
                          onChangeText={(e) => {
                            table.columns[index].options[opti] = e; this.setState({ table: table })
                          }}
                        />
                      </Item>

                    )}

                    {name.type && (name.type == 'Select' || name.type == 'MultiSelect') && <Item>
                      <Icon onPress={() => {

                        if (!table.columns[index].options) {
                          table.columns[index].options = [];
                        }
                        table.columns[index].options.push("");
                        this.setState({ table: table })

                      }
                      }
                        style={styles.input}
                        name="plus-circle"
                        type="font-awesome"
                      />
                    </Item>}





                    {name.type && (name.type == 'ObjectId' || name.type == 'MultiObject') && this.state.systemEntities &&

                      <Item>
                        <Text>Role</Text>
                        <Picker
                          selectedValue={table.columns[index].targetClass}
                          style={styles.input}
                          onValueChange={(itemValue, itemIndex) => {
                            table.columns[index].targetClass = itemValue; this.setState({ table: table })
                          }
                          }>
                          <Picker.Item label={"Please select Role"}
                          />
                          {
                            this.state.systemEntities && this.state.systemEntities.map((role, i) =>
                              <Picker.Item label={role.name} value={role._id} />
                            )}
                        </Picker>


                      </Item>
                    }
                    {name.type && (name.type == 'ObjectId' || name.type == 'MultiObject') && this.state.systemEntities &&
                      <Item floatingLabel style={{ padding: 0 }} >

                        <Label>{'Role Condition '} </Label>
                        <Input
                          style={styles.input}
                          disabled={false}
                          label='Condition'
                          value={name.defaultValue}
                          onChangeText={(e) => { table.columns[index].condition = e; this.setState({ table: table }) }}
                        />
                      </Item>


                    }


                    <Item >

                      <Left><Text>Is Null</Text></Left>
                      <Right>
                        <Switch
                          text={'Is Null'}
                          value={name.nullValue}
                          onValueChange={(e) => {
                            ;
                            table.columns[index].nullValue = e; this.setState({ table: table })
                          }}
                        />
                      </Right>
                    </Item>
                    <Item >
                      <Left><Text>dropDownValue</Text></Left>
                      <Right>
                        <Switch

                          text={'dropDownValue'}
                          value={name.dropDownValue}
                          onValueChange={(e) => {

                            name.dropDownValue = e; this.setState({ table: table })
                          }}
                        />
                      </Right>

                    </Item>
                    <Item >
                      <Left><Text>Unique</Text></Left>
                      <Right>
                        <Switch

                          text={'Unique'}
                          value={name.uniqueValue}
                          onValueChange={(e) => { table.columns[index].uniqueValue = e; this.setState({ table: table }) }}

                        />
                      </Right>

                    </Item> 
                     <Item >
                      <Left><Text>List Value</Text></Left>
                      <Right>
                        <Switch

                          text={'listValue'}
                          value={name.listValue}
                          onValueChange={(e) => { table.columns[index].listValue = e; this.setState({ table: table }) }}

                        />
                      </Right>

                    </Item>
                    <Item ></Item>
                    <Item >
                      <Icon
                        type="font-awesome"
                        name="trash"
                        onPress={(e) => { table.columns.splice(index, 1); this.setState({ table: table }) }}
                      />
                    </Item>
                  </ListItem>
                )}
              </List>
              <ListItem   onPress={() => this.addColumn()}>
                <Icon
                  
                  name="plus-circle" type="font-awesome"
                  onPress={() => this.addColumn()}
                />
              </ListItem>
              <ListItem  itemDivider onPress={() => this.addColumn()}>
              <Text>Permisions</Text>
              </ListItem>
             
              {
                table.permissions && table.permissions.map((name, index) =>
                  <View>
                    <Text>Role Class</Text>
                    <Picker
                      selectedValue={name.role}
                      style={styles.input}
                      onValueChange={(itemValue, itemIndex) => {

                        table.permissions[index].role = itemValue; this.setState({ table: table })
                      }
                      }>

                      <Picker.Item label={"AllowAll"} value="*" />
                      {
                        this.state.roles && this.state.roles.map((role, i) =>
                          <Picker.Item label={role.name} value={role._id} />
                        )}
                    </Picker>
                    <CustomSwitchWithLabel style={styles.input}
                      text={'Read'}
                      value={name.read}
                      onValueChange={(e) => {

                        table.permissions[index].read = e; this.setState({ table: table })
                      }}
                    />
                    <CustomSwitchWithLabel style={styles.input}
                      text={'Write'}
                      value={name.write}
                      onValueChange={(e) => { table.permissions[index].write = e; this.setState({ table: table }) }}
                    />
                    <CustomSwitchWithLabel style={styles.input}
                      text={'Delete'}
                      value={name.delete}
                      onValueChange={(e) => { table.permissions[index].delete = e; this.setState({ table: table }) }}
                    />
                    <CustomSwitchWithLabel style={styles.input}
                      text={'Add'}
                      value={name.canAdd}
                      onValueChange={(e) => { table.permissions[index].canAdd = e; this.setState({ table: table }) }}
                    />
                    <CustomSwitchWithLabel style={styles.input}
                      text={'canList'}
                      value={name.canList}
                      onValueChange={(e) => { table.permissions[index].canList = e; this.setState({ table: table }) }}
                    />
                    <FloatingLabelInput
                      style={styles.input}
                      disabled={false}
                      label='readRule '
                      value={name.readRule}
                      onChangeText={(e) => { table.permissions[index].readRule = e; this.setState({ table: table }) }}
                    />
                  </View>
                )
              }
              < View onPress={() => this.addPermission()}>
                <Icon
                  style={styles.input}
                  name="add"
                  onPress={() => this.addPermission()}
                />
              </View>
            </Form>
          </Content>

        </Container>
        )}
      </KeyboardShift>
    );
  }
}

const mapStateToProps = state => ({
  systemEntity: state.entityReducer.systemEntity,
  loading: state.entityReducer.loading,
  roles: state.entityReducer.roles,
  systemEntities: state.entityReducer.systemEntities,

});


const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...entityActions,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateTableScreen);