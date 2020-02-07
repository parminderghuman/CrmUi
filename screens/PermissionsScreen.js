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

class PermissionsScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            ViewColumns: true,
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

        // if (!this.state.isNew && nextProps.systemEntity) {
        //     this.setState({ table: nextProps.systemEntity, loading: false })

        // }
        // if (nextProps.loading) {
        //     this.setState({ loading: nextProps.loading })
        // }
        // if (nextProps.roles) {
        //     this.setState({ roles: nextProps.roles })
        // } if (nextProps.systemEntities) {
        //     this.setState({ systemEntities: nextProps.systemEntities })
        // }
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
    async  saveEntity() {

        var permission = this.state.permission
        
        const { navigation } = this.props;
        var id = navigation.getParam("id");
        const token = await AsyncStorage.getItem('userToken')
        var permission = await API.SaveFetchSystemPermission(token, id, this.state.permission)
        try {
            
            permission = await permission.json();
        } catch (error) {
            
            permission = { rolePermissions: {}, columnPermissions: {} }
        }
        // var permission = await permission.json();
        this.setState({

            permission: permission
        })

    }
    async fetchEntity() {
        const { navigation } = this.props;
        var parent = navigation.getParam("parent");

        var id = navigation.getParam("id");
        const token = await AsyncStorage.getItem('userToken')

        var table = await API.FetchEntity(token, "system_tables", id)
        var table = await table.json();
        
        var permission = await API.FetchSystemPermission(token, id)
        try {
            permission = await permission.json();

        } catch (e) {
            // var parent = navigation.getParam("parent");
            permission = { rolePermissions: {}, columnPermissions: {}, parentId: parent._id }

        }

        //if (permission.status == 500) {
        // }
        var query = {};
        if (parent) {
            query['parent_id'] = parent._id;
        }
        var role = await API.FetchEntities(token, 'Role', query)
        var role = await role.json();
        role.unshift({ _id: null, name: "ALL" })

        for (var i in role) {
            if (!permission.rolePermissions[role[i]._id]) {
                permission.rolePermissions[role[i]._id] = {}
            }
            if (!permission.columnPermissions[role[i]._id]) {
                permission.columnPermissions[role[i]._id] = {}
            }
            for (var j in table.columns) {
                if (!permission.columnPermissions[role[i]._id][table.columns[j].name]) {
                    permission.columnPermissions[role[i]._id][table.columns[j].name] = { read: true, write: true }
                }
                //permission.columnPermissions[role[i]._id][table.columns[j].name] = { read: true, write: true }
            }

        }


        this.setState({
            role: role,
            permission: permission, table: table
        })
    }
    componentDidMount() {
        const { navigation } = this.props;
        navigation.setParams({
            saveEntity: this.saveEntity,
            fetchEntity: this.fetchEntity
        })

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
            head: {
                padding: 3,
                color: "black",
                fontWeight: "bold"
            }, headI: {
                padding: 10,
                color: "black",
                fontWeight: "bold"
            }, headp: {
                padding: 5,
                color: "black",
                fontWeight: "bold"
            }
        });


        return (
            <KeyboardShift>
                {() => (<Container>

                    <Content contentContainerStyle={{ flexDirection: "row" }} keyboardShouldPersistTaps='handled' >
                        <ScrollView directionalLockEnabled={false}
                            horizontal={true} >
                            <View style={{ flexDirection: "column" }} >
                                <View>
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ flexDirection: "column" }} >
                                            <Text style={styles.head}>Heading : </Text>
                                            <Text style={styles.head}>Read : </Text>
                                            <Text style={styles.head}>Write : </Text>
                                            <Text style={styles.head}>Delete : </Text>
                                            <Text style={styles.head}>Add : </Text>
                                            <Text style={styles.head}>CanList : </Text>
                                            <Text style={styles.head}>Read Rule : </Text>
                                            <Text style={styles.headI}> </Text>


                                        </View>
                                        {

                                            this.state.permission && this.state.role.map((key, ind) => {
                                                var name = this.state.permission.rolePermissions[key._id];

                                                return <View style={{ flexDirection: "column" }}>
                                                    <Text>{key.name}</Text>

                                                    <CustomSwitchWithLabel

                                                        value={name.read}
                                                        onValueChange={(e) => {

                                                            this.state.permission.rolePermissions[key._id].read = e; this.setState({ permission: this.state.permission })
                                                        }}
                                                    />
                                                    <CustomSwitchWithLabel

                                                        value={name.write}
                                                        onValueChange={(e) => {
                                                            this.state.permission.rolePermissions[key._id].write = e; this.setState({ permission: this.state.permission })
                                                        }}
                                                    />
                                                    <CustomSwitchWithLabel

                                                        value={name.delete}
                                                        onValueChange={(e) => {
                                                            this.state.permission.rolePermissions[key._id].delete = e; this.setState({ permission: this.state.permission })
                                                        }}
                                                    />
                                                    <CustomSwitchWithLabel

                                                        value={name.canAdd}
                                                        onValueChange={(e) => {
                                                            this.state.permission.rolePermissions[key._id].canAdd = e; this.setState({ permission: this.state.permission })
                                                        }}
                                                    />
                                                    <CustomSwitchWithLabel

                                                        value={name.canList}
                                                        onValueChange={(e) => {
                                                            this.state.permission.rolePermissions[key._id].canList = e; this.setState({ permission: this.state.permission })
                                                        }}
                                                    />
                                                    <FloatingLabelInput

                                                        disabled={false}
                                                        label='readRule '
                                                        value={name.readRule}
                                                        onChangeText={(e) => {
                                                            this.state.permission.rolePermissions[key._id].readRule = e; this.setState({ permission: this.state.permission })
                                                        }}
                                                    />

                                                </View>

                                            })}
                                    </View>
                                </View>
                                <View>
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ flexDirection: "column" }} >
                                            <Text style={{ padding: 1 }}></Text>
                                            {
                                                this.state.table.columns.map((k, i) =>
                                                    <View>

                                                        <Text style={styles.headp}>{k.displayName} r:</Text>
                                                        <Text style={styles.headp}>w</Text>
                                                    </View>
                                                )
                                            }
                                        </View>
                                        {
                                            this.state.permission && this.state.role.map((key, ind) => {
                                                var cp = this.state.permission.columnPermissions[key._id];
                                                return <View style={{ flexDirection: "column" }}>
                                                    <Text>{key.name}</Text>
                                                    {this.state.table.columns.map((c, ci) => {
                                                        var name = this.state.permission.columnPermissions[key._id][c.name];
                                                        return <View style={{ flexDirection: "column", borderColor: "red", borderWidth: 1 }}>
                                                            <CustomSwitchWithLabel
                                                                disabled={c.type == "Section"}
                                                                value={name.read}
                                                                onValueChange={(e) => {
                                                                    this.state.permission.columnPermissions[key._id][c.name].read = e; this.setState({ permission: this.state.permission });
                                                                }}
                                                            />
                                                            <CustomSwitchWithLabel
                                                                disabled={c.type == "Section"}
                                                                value={name.write}
                                                                onValueChange={(e) => {
                                                                    this.state.permission.columnPermissions[key._id][c.name].write = e; this.setState({ permission: this.state.permission });
                                                                }}
                                                            />
                                                        </View>
                                                    })}
                                                </View>
                                            })
                                        }

                                    </View>
                                </View>
                            </View>
                        </ScrollView>

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


export default connect(mapStateToProps, mapDispatchToProps)(PermissionsScreen);