import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {  Input, Layout, Select, CheckBox, List,
  ListItem, Text ,Button} from '@ui-kitten/components';
import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';

class HomeScreen extends React.Component {

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
  }

openTable(v){
  this.props.navigation.navigate('EntityList',{
    'system_tables':v
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
    this.props.fetchSystemEntities("system_tables");
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Tables',
   
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
    const {entities} = this.state
    
    return (
      <ScrollView style={styles.container}>
        {
         
         entities.map((v,i)=>
          <Layout>
            <Text>{v.name}</Text>
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
  entities: state.entityReducer.systemEntities,
  loading: state.entityReducer.loading,
});


const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...entityActions,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);