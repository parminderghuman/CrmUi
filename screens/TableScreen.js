import React from 'react';
import { ScrollView, StyleSheet,View ,Text,Button} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';

class TableScreen extends React.Component {

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

    this.props.navigation.navigate('CreateTable', {
      'id': v._id
    })
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.entities) {
      this.setState({ entities: nextProps.entities })
    }
    if (nextProps.loading) {
      this.setState({ loading: nextProps.loading })
    }

  }
  componentDidMount() {

    const { navigation } = this.props;
    navigation.setParams({
      refreshData: this.refreshData,
    })
    this.refreshData();
  }
  refreshData() {
    
    this.props.fetchSystemEntities("system_tables");
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Tables',
    headerLeft: () => (
      <View style={{
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


      </View>
    ),

    headerRight: () => (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        paddingTop: 15,
        backgroundColor: '#fff'
      }}>
        <Icon
          onPress={() => navigation.navigate('CreateTable')}
          style={{
            flex: 1,
            margin: 8,
          }}
          name="add"
        />

        <Icon
          onPress={() => {
            try {
              navigation.getParam("refreshData")();
            } catch (e) { }
          }}
          style={{
            flex: 1,
            margin: 8,
          }}
          name="refresh"
        />
      </View>
    ),
  });


  handleAdd() {
    this.props.navigation.navigate('CreateTable')
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
            <View>
              <Text>{v.name}</Text>
              <Button onPress={(e) => this.openTable(v)} title={"edit"}>
               
            </Button>

            </View>
          )}
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({
  entities: state.entityReducer.systemEntities,
  loading: state.entityReducer.loading,
});


const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...entityActions,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(TableScreen);