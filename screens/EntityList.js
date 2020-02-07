import React from 'react';
import {
    ScrollView,
    StyleSheet,
    AsyncStorage,
    View, Button, FlatList, Dimensions
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Spinner, Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, SwipeRow } from 'native-base';

import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';
import API from "../api/entity-save";
class EntityList extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoading: false,
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

    openTable(v, title) {
        var s = this.state
        
        this.props.navigation.navigate('CreateEntity', {
            "system_tables": this.state.system_tables,
            "entity": v,
            "parent": this.state.parent,
            Title: title,
            TitleIcon: this.props.navigation.getParam('TitleIcon')
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
        headerStyle: {
            backgroundColor: '#352e4a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        headerRight: () => (
            <View style={{
                paddingRight: 10,
                flexDirection: 'row',
            }}>
              {navigation.getParam("system_tables") && navigation.getParam("system_tables").permission && navigation.getParam("system_tables").permission.canAdd == true&&  <Icon
                    onPress={() => {
                        try {
                            navigation.getParam('handleAddE')()
                        } catch (e) {

                        }
                    }}
                    style={{
                        paddingRight: 10,
                        color:"#fff"
                    }}
                    type="font-awesome"
                    name="plus"
                    color="#fff"
                />}
                <Text>  </Text>
              
                <Icon
                    onPress={() => {
                        try {
                            navigation.getParam('refreshData')()
                        } catch (e) {

                        }
                    }}
                    style={{
                        paddingRight: 10,
                    }}
                    type="font-awesome"
                    color="#fff"
                    name="refresh"
                />
            </View>
        ), headerLeft: () => (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                paddingRight: 10,
            }}>
                <Icon
                    onPress={() => navigation.openDrawer()}
                    style={{

                        paddingRight: 10,
                    }}
                    type="font-awesome"
                    name="bars" 
                    color="#fff"
                />
<Text>  </Text>
                <Icon
                    onPress={() => navigation.openDrawer()}
                    style={{
                        
                        paddingLeft: 10,
                        paddingRight: 10,
                    }}
                    type="font-awesome" 
                    color="#fff"
                    paddingLeft="10"
                    name={navigation.getParam('TitleIcon') + ""}
                />
            </View>
        ),
    });

  
      componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
      }
     
    componentDidMount() {

        const { navigation } = this.props

        this.focusListener = navigation.addListener("didFocus", () => {
            this.refreshData();
          });
        

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
        await this.setState({ isLoading: true })
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
        await this.setState({ isLoading: false })
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
        //const ds = new FlatList.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });


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

                {entities && <FlatList
                    data={entities}

                    renderItem={data => {
                        
                        const item = data.item
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
                        return <ListItem avatar onPress={(e) => this.openTable(item, obj['main'])} title={"edit"}>
                            <Body style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1 }}><Text>{obj['main']}</Text>
                                    <Text note>{obj['sec']}</Text>
                                </View>
                                <View ><Text style={{ flex: 1 }}></Text>
                                    <Text note style={{ bottom: 0, position: "relative", right: 0 }}>{new Date(item.updateAt).toLocaleString()}</Text>
                                </View>
                            </Body>
                            <Right style={{ flexDirection: "row", alignContent: 'center', alignItems: 'center' }}>



                                <Icon name="chevron-right"
                                    type="font-awesome"
                                    size={10}
                                ></Icon>
                                 {system_tables && system_tables.childTables && system_tables.childTables.map((k, i) =>
                                 <Button onPress={(e) => this.openList(k, v)} title={k.name}>

                                 </Button>

                             )}
                            </Right>

                           
                        </ListItem>
                    }

                    }

                />}



            </Content>
            {this.state.isLoading && <View style={{
                backgroundColor: "rgba(12, 12, 12, .5)",
                position: "absolute", alignItems: "center", justifyContent: "center", flex: 1, width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
            }}><Spinner color='blue' /></View>}
        </Container>
        );
    }
}


export default EntityList;