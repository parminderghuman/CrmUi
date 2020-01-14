import React from 'react';
import { ScrollView, StyleSheet, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {
    Input, Layout, Select, CheckBox, List,
    ListItem, Text, Button
} from '@ui-kitten/components';
import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';
import API from "../api/entity-save";
class EntityList extends React.Component {

    constructor() {
        super();
        this.state = {
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
            entities: []
        };
        this.handleAddE = this.handleAddE.bind(this);
        this.openTable = this.openTable.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.openList = this.openList.bind(this);
    }

    openTable(v) {

        this.props.navigation.navigate('CreateEntity', {
            "system_tables": this.state.system_tables,
            "entity": v,
            "parent": this.state.parent
        })
    }
    handleAddE() {
        debugger
        this.props.navigation.navigate('CreateEntity', {
            "system_tables": this.state.system_tables,
            "entity": undefined,
            "parent": this.state.parent
        })
    }
    openList(v, t) {
        this.props.navigation.navigate('Home', {
            "system_tables": v,
            "parent": t

        })
    }
    componentWillReceiveProps(nextProps) {
        debugger
        this.refreshData();

    }



    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('Title', 'Table') + "",
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
                            navigation.getParam('handleAddE')()
                        } catch (e) {
                            debugger
                        }
                    }}
                    style={{
                        flex: 1,
                        margin: 8,
                    }}
                    name="add"
                />

                <Icon
                    onPress={() => {
                        try {
                            navigation.getParam('refreshData')()
                        } catch (e) {

                        }
                    }}
                    style={{
                        flex: 1,
                        margin: 8,
                    }}
                    name="refresh"
                />
            </Layout>
        ), headerLeft: () => (
            <Layout style={{
                flex: 1,
                flexDirection: 'row',
                paddingTop: 15,
                backgroundColor: '#fff'
            }}>
                <Icon
                    onPress={() => navigation.openDrawer()}
                    style={{
                        flex: 1,
                        margin: 8,
                    }}
                    name="menu"
                />


            </Layout>
        ),
    });



    componentDidMount() {

        const { navigation } = this.props
        navigation.setParams({
            'handleAddE': this.handleAddE,
            'refreshData': this.refreshData
        })
        if (navigation.getParam("system_tables")) {

            this.setState({
                system_tables: navigation.getParam("system_tables"),
                parent: navigation.getParam("parent")
            });
           

        }
        const v = navigation.getParam("system_tables")
        

        //this.props.fetchEntities("system_tables");
    }
    async refreshData() {

        const userToken = await AsyncStorage.getItem('userToken');

        const { navigation } = this.props
        const v = navigation.getParam("system_tables")
        const parent = navigation.getParam("parent");
        var tableS = await API.FetchEntity(userToken, "system_tables", v._id);
        tableS = await tableS.json();
        var query = {};
        if (parent) {
            query['parent_id'] = parent._id;
        }
        debugger
        var tableF = await API.FetchEntities(userToken, v.name, query);
        debugger
        tableF = await tableF.json();
        this.setState({
            entities: tableF, system_tables: tableS,
            parent: navigation.getParam("parent")
        })
        //const v = navigation.getParam("system_tables")
       

    }

    render() {


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
        const { entities, system_tables } = this.state

        return (
            <ScrollView style={styles.container}>
                {entities &&

                    entities.map((v, i) =>
                        <Layout>
                            {this.state.system_tables.columns.map((col, i) => {
                                return < Text> {col.name} : {v[col.name]} </ Text>
                            })}
                            <Button onPress={(e) => this.openTable(v)}>
                                edit
                 </Button>
                            {system_tables && system_tables.childTables && system_tables.childTables.map((k, i) =>
                                <Button onPress={(e) => this.openList(k, v)}>
                                    {k.name}
                                </Button>

                            )}
                        </Layout>
                    )}
            </ScrollView>
        );
    }
}


export default EntityList;