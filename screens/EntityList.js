import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {
    Input, Layout, Select, CheckBox, List,
    ListItem, Text, Button
} from '@ui-kitten/components';
import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';

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
        this.handleAdd = this.handleAdd.bind(this);
        this.openTable = this.openTable.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    openTable(v) {

        this.props.navigation.navigate('CreateEntity', {
            "system_tables": this.state.system_tables,
            "entity": v
        })
       

    }

    componentWillReceiveProps(nextProps) {
debugger
        if (nextProps.entities) {
            this.setState({ entities: nextProps.entities })
        }
        if (nextProps.loading) {
            this.setState({ loading: nextProps.loading })
        }

    }



    static navigationOptions = ({ navigation }) => ({
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
                            navigation.getParam('handleAdd')()
                        } catch (e) {

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
        ),
    });

    handleAdd() {
        this.props.navigation.navigate('CreateEntity', {
            "system_tables": this.state.system_tables,
            "entity": undefined
        })
    }

    componentDidMount() {

        const { navigation } = this.props

        this.setState({ system_tables: navigation.getParam("system_tables") });
        navigation.setParams({
            handleAdd: this.handleAdd,
            refreshData: this.refreshData
        })
        this.refreshData();
        //this.props.fetchEntities("system_tables");
    }
    refreshData() {
         const { navigation } = this.props
        const v = navigation.getParam("system_tables")
        this.props.fetchSystemEntity("system_tables", v._id);
        this.props.fetchEntities(v.name);
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
        const { entities } = this.state

        return (
            <ScrollView style={styles.container}>
                {

                    entities.map((v, i) =>
                        <Layout>
                            {this.state.system_tables.columns.map((col, i) => {
                                return < Text> {col.name} : {v[col.name]} </ Text>
                            })}
                            <Button onPress={(e) => this.openTable(v)}>
                                edit
            </Button>

                        </Layout>
                    )}
            </ScrollView>
        );
    }
}
const mapStateToProps = state => ({
    entities: state.entityReducer.entities,
    systemEntity: state.entityReducer.systemEntity

    //loading: state.entityReducer.loading, const { navigation } = this.props
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...entityActions,
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(EntityList);