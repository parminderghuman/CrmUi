import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';
import * as Api from '../api/entity-save';
import { Container, Header, Content, Form, Item, Input, Label, Button, Toast, ListItem, List, Left, Body, Right } from 'native-base';
import { Icon } from 'react-native-elements'

class SideMenu extends Component {

  constructor() {
    super();
    this.state = {
      list: [],
      user: {},
      parent: undefined,
      parentClass: undefined
    };

  }

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  componentDidMount() {
    this._bootstrapAsync();

  }
  _bootstrapAsync = async () => {
    var list = await AsyncStorage.getItem("UserEntities");
    var user = await AsyncStorage.getItem("User");
    debugger
    var parent = undefined;
    var parentClass = undefined
    user = JSON.parse(user)
    if (user.userType != "SuperAdmin") {
      parentClass = JSON.parse(list)[0];

      list = parentClass.childTables;

      const userToken = await AsyncStorage.getItem('userToken');


      var query = { "_id": user.parent_id };


      var tableF = await Api.FetchEntities(userToken, parentClass.name, query);
      tableF = await tableF.json();
      parent = tableF[0];

    } else {
      list = JSON.parse(list)
    }




    this.setState({
      list: list,
      user: user, parent: parent
    })
    if (list && list.length > 0) {
      this.props.navigation.navigate('Home', {
        'system_tables': list[0], parent: parent, "Title": list[0].displayName?list[0].displayName:list[0].name
      });
     
    }
  }
  render() {
    const { list, user, parent } = this.state;
    return (
      <Container style={styles.container}>
        <Content  >
          <Item style={styles.content}>
            <Icon name="user"
              type="font-awesome"
              size={75}
            >
            </Icon>
          </Item>
          <Item style={styles.content, { flexDirection: 'column' }}>

            <Text style={styles.sectionHeadingStyle}>
              {user.email}
            </Text>
            <Text style={styles.sectionHeadingStyle}>
              {parent ? parent.name : ""}
            </Text>
          </Item>
          <List>
            {list && list.map((l, i) =>
              <ListItem avatar>
                <Left>
                  <Icon name={l.icon?l.icon:'cog'}
                    type="font-awesome"
                  ></Icon>
                </Left>
                <Body>
                  <Text onPress={(e) => {
                    // this.props.navigation.pop(1);

                    if (l.name == 'system_tables') {
                      this.props.navigation.navigate('TableListAdmin')
                    } else {
                      this.props.navigation.navigate('Home', {
                        'system_tables': l,
                        'parent': parent,
                         "Title": l.displayName?l.displayName:l.name

                      })
                      //this.props.navigation.setParams({ "Title": l.name })
                    }
                  }

                  } >
                    {l.displayName?l.displayName:l.name }
                  </Text>
                </Body>
                <Right>
                  <Icon name="chevron-right"
                    type="font-awesome"
                    size={10}
                  ></Icon>
                </Right>
              </ListItem>
            )}

          </List>
        </Content>
        <View style={styles.footerContainer}>
          <List>
            <ListItem>
              <Left>
                <Icon name="power-off"
                  type="font-awesome"
                  size={20}
                ></Icon>
                <Text
              style={{fontSize:16,marginLeft:20}}
                onPress={(e) => {
                  AsyncStorage.clear();
                  this.props.navigation.navigate('Auth');
                }
                }>
                  Logout
                </Text>
              </Left>
              <Body>
              
              </Body>
              <Right>
                <Text></Text>
              </Right>
            </ListItem>
          </List>
        </View>
      </Container>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};


const styles = {
  content: {
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    flex: 1, padding: 10
  },
  container: {
    paddingTop: 20,
    flex: 1
  },
  navItemStyle: {
    padding: 10
  },
  navSectionStyle: {
    backgroundColor: 'lightgrey'
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  footerContainer: {
    padding: 0,
    backgroundColor: 'lightgrey'
  }
};
export default SideMenu;