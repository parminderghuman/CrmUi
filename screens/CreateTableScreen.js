import React from 'react';
import { ScrollView, StyleSheet, Button, Picker, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {
  Input, Layout, Select, CheckBox, List,
  ListItem
} from '@ui-kitten/components';
import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';

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
      }
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.addColumn = this.addColumn.bind(this)
    this.saveEntity = this.saveEntity.bind(this)
    this.addPermission = this.addPermission.bind(this)
    this.fetchEntity = this.fetchEntity.bind(this)

  }

  componentWillReceiveProps(nextProps) {

    if (!this.state.isNew && nextProps.systemEntity) {
      this.setState({ table: nextProps.systemEntity })
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
    this.state.table.permissions.push({ name: '' })
    this.setState({ table: this.state.table })
  }

  addColumn() {
    this.state.table.columns.push({ name: "", type: 'Boolean', nullValue: false, uniqueValue: true, defaultValue: null, targetClass: null })
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
        }
      })
    }
    this.props.fetchRoles("Role")
  }

  saveEntity() {

    this.props.saveSystemEntity("system_tables", this.state.table)
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
    this.fetchEntity();

  }
  handleAdd() {
    this.props.navigation.navigate('CreateTable')
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
    return (
      <ScrollView style={styles.container}>

        <Input
          value={table.name}
          label='Name'
          placeholder='Enter Table Name'
          onChangeText={(ev) => {

            table.name = ev; this.setState({ table: table })
          }}
        />
        <Icon
          style={styles.input}
          name={table.icon}
        />
        <Input
          style={styles.input}
          disabled={false}
          placeholder='Icon Name'
          value={table.icon}
          onChangeText={(e) => { table.icon = e; this.setState({ table: table }) }}
        />

        <Text>Fields</Text>

        {table.columns.map((name, index) =>

          <Layout key={index} style={{ borderStyle: 'solid', borderBottomWidth: 1, borderBottomColor: 'grey', }}>
            <Layout style={styles.containerLayout}>


              <Input
                style={styles.input}
                disabled={false}
                placeholder='Field Name'
                value={name.name}
                onChangeText={(e) => { table.columns[index].name = e; this.setState({ table: table }); }}
              />
              <Input
                style={styles.input}
                disabled={false}
                placeholder='Field Name'
                value={name.displayName}
                onChangeText={(e) => { table.columns[index].displayName = e; this.setState({ table: table }) }}
              />


            </Layout>
            <Layout style={styles.containerLayout}>

              <Picker
                selectedValue={name.type}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => { table.columns[index].type = itemValue; this.setState({ table: table }) }
                }>
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
              </Picker>

              <Input
                style={styles.input}
                disabled={false}
                placeholder='Default Value'
                value={name.defaultValue}
                onChangeText={(e) => { table.columns[index].defaultValue = e; this.setState({ table: table }) }}
              />
              {name.type && name.type == 'Select' && name.options && name.options.map((opt, opti) =>
                <Input
                  style={styles.input}
                  disabled={false}
                  placeholder='Field Name'
                  value={opt}
                  onChangeText={(e) => {
                    table.columns[index].options[opti] = e; this.setState({ table: table })
                  }}
                />
              )}
              {name.type && name.type == 'Select' && <Layout>
                <Icon onPress={() => {

                  if (!table.columns[index].options) {
                    table.columns[index].options = [];
                  }
                  table.columns[index].options.push("");
                  this.setState({ table: table })

                }
                }
                  style={styles.input}
                  name="add"
                />
              </Layout>}

              {name.type && name.type == 'ObjectId' && this.state.systemEntities &&
                <Picker
                  selectedValue={table.columns[index].targetClass}
                  style={styles.input}
                  onValueChange={(itemValue, itemIndex) => {
                    table.columns[index].targetClass = itemValue; this.setState({ table: table })
                  }
                  }>
                  {
                    this.state.systemEntities && this.state.systemEntities.map((role, i) =>
                      <Picker.Item label={role.name} value={role._id} />
                    )}
                </Picker>
              }

            </Layout>
            <Layout style={styles.containerLayout}>

              <CheckBox style={styles.input}
                text={'Null'}
                checked={name.nullValue}
                onChange={(e) => { table.columns[index].nullValue = e; this.setState({ table: table }) }}
              />

              <CheckBox style={styles.input}
                text={'dropDownValue'}
                checked={name.dropDownValue}
                onChange={(e) => { table.columns[index].dropDownValue = e; this.setState({ table: table }) }}
              />
              <CheckBox style={styles.input}
                text={'Unique'}
                checked={name.uniqueValue}
                onChange={(e) => { table.columns[index].uniqueValue = e; this.setState({ table: table }) }}
              />
              <Icon
                style={styles.input}
                name="delete"
                onPress={(e) => { table.columns.splice(index, 1); this.setState({ table: table }) }}
              />
            </Layout>
          </Layout>
        )}

        <Layout onPress={() => this.addColumn()}>
          <Icon
            style={styles.input}
            name="add"
            onPress={() => this.addColumn()}
          />
        </Layout>
        <Text>Permisions</Text>
        {table.permissions && table.permissions.map((name, index) =>
          <Layout>
            <Picker
              selectedValue={name.role}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) => {

                table.permissions[index].role = itemValue; this.setState({ table: table })
              }
              }>
              {
                this.state.roles && this.state.roles.map((role, i) =>
                  <Picker.Item label={role.name} value={role._id} />
                )}
            </Picker>
            <CheckBox style={styles.input}
              text={'Read'}
              checked={name.read}
              onChange={(e) => { table.permissions[index].read = e; this.setState({ table: table }) }}
            />
            <CheckBox style={styles.input}
              text={'Write'}
              checked={name.write}
              onChange={(e) => { table.permissions[index].write = e; this.setState({ table: table }) }}
            />
            <CheckBox style={styles.input}
              text={'Delete'}
              checked={name.delete}
              onChange={(e) => { table.permissions[index].delete = e; this.setState({ table: table }) }}
            />
          </Layout>
        )}
        <Layout onPress={() => this.addPermission()}>
          <Icon
            style={styles.input}
            name="add"
            onPress={() => this.addPermission()}
          />
        </Layout>
      </ScrollView>
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