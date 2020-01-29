import React from 'react';
import {
    ScrollView,
    StyleSheet,
    AsyncStorage,
    View, Button, FlatList
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';

import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';
import API from "../api/entity-save";
class EntityList extends React.Component {

    constructor() {
        super();
        this.state = {
            dependencyTable: {},
            dependencyData: {},
            dependencyDataMap: {},
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
        this.GetDisplayValue = this.GetDisplayValue.bind(this)
        this.getDependendData = this.getDependendData.bind(this)
    }

    openTable(v,title) {

        this.props.navigation.navigate('CreateEntity', {
            "system_tables": this.state.system_tables,
            "entity": v,
            "parent": this.state.parent,
            Title:title
        })
    }
    handleAddE() {

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

        this.refreshData();
        try {
            if (this.state.Title != nextProps.navigation.getParam('Title') + "") {
                this.setState({
                    Title: this.props.navigation.getParam('Title')
                });
            }
        } catch (e) {

        }


    }
    GetDisplayValue(data, value) {
        if (this.state.dependencyDataMap[value.targetClass] && data[value.name]) {

            if (data[value.name] instanceof Array) {
                var a = data[value.name];
            } else {
                var a = data[value.name].split(",");
            }

            var b = [];
            for (var i in a) {
                try {
                    b.push(this.state.dependencyDataMap[value.targetClass][a[i]][this.state.dependencyTable[value.targetClass].name])
                } catch (e) {

                }
            }
            return b.join(",");
        } else {
            return "";
        }
    }


    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('Title') + "",
        headerRight: () => (
            <View style={{
               paddingRight:10,
                flexDirection: 'row',
                backgroundColor: '#fff'
            }}>
                <Icon
                    onPress={() => {
                        try {
                            navigation.getParam('handleAddE')()
                        } catch (e) {

                        }
                    }}
                    style={{
                        paddingRight:10,
                    }}
                    type="font-awesome"
                    name="plus"
                />
<Text>  </Text>
                <Icon
                    onPress={() => {
                        try {
                            navigation.getParam('refreshData')()
                        } catch (e) {

                        }
                    }}
                    style={{
                        paddingRight:10,
                    }}
                    type="font-awesome"

                    name="refresh"
                />
            </View>
        ), headerLeft: () => (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                
                backgroundColor: '#fff'
            }}>
                <Icon
                    onPress={() => navigation.openDrawer()}
                    style={{
                        margin: 8,
                        padding:4
                    }}
                    type="font-awesome"

                    name="bars"
                />


            </View>
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

        var tableF = await API.FetchEntities(userToken, v.name, query);

        tableF = await tableF.json();
        this.setState({
            entities: tableF, system_tables: tableS,
            parent: navigation.getParam("parent")
        })
        //const v = navigation.getParam("system_tables")
        tableS.columns.map((col, ind) => {
            if (col.type == "ObjectId" || col.type == "MultiObject") {
                this.getDependendData(col)

            }
        });

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

        return (<Container>

            <Content>

                {entities && <List>

                    {entities.map((item, index) => {
                        debugger
                        const v = item
                        var obj = { 'main': "", 'sec': undefined };
                        this.state.system_tables.columns.map((col, i) => {
                            if (col.dropDownValue) {
                                if (col.type == "MultiObject" || col.type == "ObjectId") {
                                    obj['main'] = this.GetDisplayValue(v, col)
                                } else if (col.type == "Address" && v[col.name]) {
                                    obj['main'] = JSON.stringify(v[col.name])
                                }
                                else {
                                    obj['main'] = v[col.name]
                                }
                            } else if (col.listValue) {
                                var a = '';

                                if (col.type == "MultiObject" || col.type == "ObjectId") {
                                    a = this.GetDisplayValue(v, col)
                                } else if (col.type == "Address" && v[col.name]) {
                                    a = JSON.stringify(v[col.name])
                                }
                                else {
                                    a = v[col.name]
                                }

                                if (!obj['sec']) {
                                    obj['sec'] = a
                                } else {
                                    obj['sec'] += ", " + a
                                }
                            }
                        });
                        return <ListItem avatar onPress={(e) => this.openTable(item,obj['main'])} title={"edit"}>
                            <Body  style={{ flexDirection: "row"}}>
                                <View style={{flex:1}}><Text>{obj['main']}</Text>
                                <Text note>{obj['sec']}</Text>
                                </View>
                                <View ><Text style={{flex:1}}></Text>
                                     <Text note style={{bottom:0,position:"relative",right:0}}>{new Date(item.updateAt).toLocaleString()}</Text>
                                </View>
                            </Body>
                            <Right style={{ flexDirection: "row",alignContent:'center',alignItems:'center' }}>


                               
                               
                                <Icon name="chevron-right"
                                    type="font-awesome"
                                    size={10}
                                ></Icon>

                            </Right>
                        </ListItem>
                    }
                        // <View>
                        //     {this.state.system_tables.columns.map((col, i) => {
                        //         const v = item

                        //         if (col.type == "MultiObject" || col.type == "ObjectId") {
                        //             return < Text> {col.displayName} : {this.GetDisplayValue(v, col)} </ Text>
                        //         } if (col.type == "Address" && v[col.name]) {
                        //             return < Text> {col.displayName} : {JSON.stringify(v[col.name])} </ Text>
                        //         }
                        //         else {
                        //             return < Text> {col.displayName} : {v[col.name]} </ Text>
                        //         }

                        //     })}
                        //     <Button onPress={(e) => this.openTable(item.item)} title={"edit"}>

                        //     </Button>
                        //     {system_tables && system_tables.childTables && system_tables.childTables.map((k, i) =>
                        //         <Button onPress={(e) => this.openList(k, item.item)} title={k.name}>

                        //         </Button>

                        //     )}
                        // </View>
                    )}
                </List>

                    //     entities.map((v, i) =>
                    //         <View>
                    //             {this.state.system_tables.columns.map((col, i) => {
                    //                 if(col.type == "MultiObject" || col.type == "ObjectId"){
                    //                     return < Text> {col.name} : {this.GetDisplayValue(v,col)} </ Text>
                    //                 } if(col.type == "Address" && v[col.name]){
                    //                     return < Text> {col.name} : {JSON.stringify(v[col.name])} </ Text>
                    //                 }
                    //                 else{
                    //                     return < Text> {col.name} : {v[col.name]} </ Text>
                    //                 }

                    //             })}
                    //             <Button onPress={(e) => this.openTable(v)} title={"edit"}>

                    //  </Button>
                    //             {system_tables && system_tables.childTables && system_tables.childTables.map((k, i) =>
                    //                 <Button onPress={(e) => this.openList(k, v)} title={k.name}>

                    //                 </Button>

                    //             )}
                    //         </View>
                    //     )
                }

            </Content>
        </Container>
        );
    }
}


export default EntityList;