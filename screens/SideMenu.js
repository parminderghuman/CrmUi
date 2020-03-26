import PropTypes from 'prop-types';
import React, { Component, TouchableHighlight } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, AsyncStorage, Modal, TouchableHighlightBase, Alert, Dimensions, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import * as Api from '../api/entity-save';
import { Container, Header, Content, Form, Item, Input, Label, Button, Toast, ListItem, List, Left, Body, Right, Spinner } from 'native-base';
import { Icon } from 'react-native-elements'
import { isLoading } from 'expo-font';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

import { Notifications } from 'expo';
import { Marker } from 'react-native-maps';


class SideMenu extends Component {

  constructor() {
    super();
    this.state = {
      list: [],
      user: {},
      parent: undefined,
      parentClass: undefined,
      modalVisible: false,
      password: "",
      oldPassword: "",
      rePassword: "",
      error: false, isLoading: false, showMap: false,
      location: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fecthLocation = this.fecthLocation.bind(this);

  }

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  async componentDidMount() {
    this._bootstrapAsync();



  }
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    var user = await AsyncStorage.getItem("User");
    user = JSON.parse(user)

    try {
      var deviceToken = "";
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status != "granted") {
      } else {
        try {
          let token = await Notifications.getDevicePushTokenAsync({ "gcmSenderId": "592786157647" });
          deviceToken = token.data;
        } catch (devErrro) {
          let token = await Notifications.getExpoPushTokenAsync();
          deviceToken = token;
        }


       var resp = await  Api.addToken(userToken,deviceToken, Platform.OS)
      }
    } catch (noError) {
      console.log("noError : " + noError.message)
    }

    console.log("deviceToken :  " + deviceToken)
    var list = await AsyncStorage.getItem("UserEntities");


    var parent = undefined;
    var parentClass = undefined

    if (user.userType != "SuperAdmin") {
      parentClass = JSON.parse(list)[0];
      list = parentClass.childTables;



      var query = { "_id": { "$oid": user.activeCompany.parent_id } };
      var parama = { "query": encodeURI(JSON.stringify(query)) }

      var tableF = await Api.FetchEntities(userToken, parentClass.name, parama);
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
        'system_tables': list[0], parent: parent,
        "Title": list[0].displayName ? list[0].displayName : list[0].name,
        "TitleIcon": list[0].icon
      });

    }

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }


    //var t = await Location.stopLocationUpdatesAsync("background-location-task")
    //return
    if (Platform.OS != "web") {
      var l = await Location.hasStartedLocationUpdatesAsync("background-location-task")
      if (!l) {

        var options = {
          accuracy: Location.Accuracy.High,
          //timeInterval:1,
          distanceInterval: 1,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Test",
            notificationBody: "test",
            notificationColor: "#RRGGBB"
          }
        }
        var m = await Location.startLocationUpdatesAsync("background-location-task", options)


      }
      var ma = await BackgroundFetch.registerTaskAsync("background-location-task1", { minimumInterval: 1, stopOnTerminate: false, startOnBoot: true })
      var me = await BackgroundFetch.setMinimumIntervalAsync(10);
      var is = await TaskManager.isTaskRegisteredAsync("background-location-task")
      //var is1  = await  TaskManager.isTaskRegisteredAsync("background-location-task1")


    }
  }
  handleChange(type, value) {
    this.setState({ [type]: value });
    this.setState({ error: false })
  }
  async handleSubmit() {


    if (this.state.password != this.state.rePassword) {
      this.setState({ error: true, errorMessage: "New Password And Confirm Password Not Matched" })

    } else {


      const userToken = await AsyncStorage.getItem('userToken');

      var resp = await Api.updatePassword(userToken, { password: this.state.password, rePassword: this.state.rePassword, oldPassword: this.state.oldPassword });

      var json = await resp.json();

      if (json) {
        this.setState({ modalVisible: false })

        Toast.show({
          text: "Password Chnage Sucessfully!",

        })
      } else {
        Alert.alert(
          'Wrong Ppssword',
          "Old Password is wrong.",
          [{
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          }
          ],
          { cancelable: true },
        );
      }
    }
    this.setState({
      isLoading: false,
    });


  }

  async fecthLocation() {
    const userToken = await AsyncStorage.getItem('userToken');

    var l = await Api.FetchLocation(userToken);
    var a = await l.json();

    this.setState({ locations: a.results })
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
              {user.username ? user.username.toUpperCase() : ""}
            </Text>
            <Text style={styles.sectionHeadingStyle}>
              {parent ? parent.name : ""}
            </Text>
          </Item>
          <List>
            {list && list.map((l, i) =>
              <ListItem avatar>
                <Left style={{ marginRight: 20 }}>
                  <Icon name={l.icon ? l.icon : 'cog'}
                    type="font-awesome"
                  ></Icon>
                </Left>
                <Body>
                  <Text onPress={(e) => {
                    // this.props.navigation.pop(1);


                    this.props.navigation.navigate('Home', {
                      'system_tables': l,
                      'parent': parent,
                      "Title": l.displayName ? l.displayName : l.name,
                      "TitleIcon": l.icon
                    })
                    //this.props.navigation.setParams({ "Title": l.name })

                    this.props.navigation.closeDrawer()
                  }

                  } >
                    {l.displayName ? l.displayName : l.name}
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
            <ListItem avatar>
              <Left style={{ marginRight: 20 }}>
                <Icon name={'comments'}
                  type="font-awesome"
                ></Icon>
              </Left>
              <Body>
                <Text onPress={(e) => {
                  this.props.navigation.closeDrawer();
                  this.props.navigation.navigate('ChatListScreen', {
                    //'system_tables': l,
                    'parent': parent,
                    "Title": 'Messages',
                    "TitleIcon": 'comments'
                  });

                }} >
                  Messages
                </Text>
              </Body>
              <Right>
                <Icon name="chevron-right"
                  type="font-awesome"
                  size={10}
                ></Icon>
              </Right>
            </ListItem>


            {((this.state.user.activeCompany && this.state.user.activeCompany.userType == "CompanyAdmin") || this.state.user.userType == "SuperAdmin") && <ListItem avatar>
              <Left style={{ marginRight: 20 }}>
                <Icon name={'cog'}
                  type="font-awesome"
                ></Icon>
              </Left>
              <Body>
                <Text onPress={(e) => {
                  this.props.navigation.closeDrawer();
                  this.props.navigation.navigate('TableListAdmin'
                    , {
                      //'system_tables': l,
                      'parent': parent,
                      "Title": 'Permissions',
                      "TitleIcon": 'cog'
                    });

                }} >
                  Permissions
                </Text>
              </Body>
              <Right>
                <Icon name="chevron-right"
                  type="font-awesome"
                  size={10}
                ></Icon>
              </Right>
            </ListItem>
            }
            <ListItem avatar>
              <Left style={{ marginRight: 20 }}>
                <Icon name={'key'}
                  type="font-awesome"
                ></Icon>
              </Left>
              <Body>
                <Text onPress={(e) => {
                  // this.props.navigation.pop(1);
                  this.setState({ modalVisible: true })

                }} >
                  Reset Password
                  </Text>
              </Body>
              <Right>
                <Icon name="chevron-right"
                  type="font-awesome"
                  size={10}
                ></Icon>
              </Right>
            </ListItem>
            <ListItem avatar>
              <Left style={{ marginRight: 20 }}>
                <Icon name={'map-marker'}
                  type="font-awesome"
                ></Icon>
              </Left>
              <Body>
                <Text onPress={(e) => {

                  this.setState({ showMap: true })
                  this.fecthLocation();

                }} >
                  Location
                  </Text>
              </Body>
              <Right>
                <Icon name="chevron-right"
                  type="font-awesome"
                  size={10}
                ></Icon>
              </Right>
            </ListItem>
          </List>
        </Content>
        <View style={styles.footerContainer}>
          <List>
            <ListItem onPress={(e) => {
              AsyncStorage.clear();
              this.props.navigation.navigate('Auth');
            }
            }
            >
              <Left style={{ marginRight: 20 }}>
                <Icon name="power-off"
                  type="font-awesome"
                  size={20}
                ></Icon>
                <Text
                  style={{ fontSize: 16, marginLeft: 20 }}
                >
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

        {this.state.modalVisible && <Modal
          animationType="slide"
          transparent={true}
          style={{ backgroundColor: "red" }}
          backgroundColor={"grey"}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            //Alert.alert('Modal has been closed.');
          }}>

          <View style={{ backgroundColor: "rgba(12, 12, 12, .5)", alignItems: "center", justifyContent: "center", flex: 1 }}>

            <View style={{ backgroundColor: "white", margin: 30, borderRadius: 10, alignSelf: "stretch" }}>
              <Header style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: "center", justifyContent: "center" }}>
                <Label style={{ color: "white", flex: 1 }} ><Text >Change Password</Text>     </Label>
                <Icon style={{ position: "absolute", left: 0, end: 0 }}
                  color="white"
                  name="cancel"
                  onPress={() => {
                    this.setState({ modalVisible: false })

                  }}
                />
              </Header>
              <Form style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10 }}>
                <Item floatingLabel style={{ padding: 10 }}>
                  <Label>Old Password</Label>
                  <Input
                    onChangeText={value => this.handleChange('oldPassword', value)}
                    secureTextEntry
                    returnKeyType='next'

                    autoCorrect={false}
                  // onSubmitEditing={() => {this.passwordInput.focus()}}
                  // blurOnSubmit={false}


                  />
                </Item>
                <Item floatingLabel style={{ padding: 10 }}>
                  <Label>New Password</Label>
                  <Input
                    onChangeText={value => this.handleChange('password', value)}
                    secureTextEntry
                    returnKeyType='next'

                    autoCorrect={false}
                  // onSubmitEditing={() => {this.passwordInput.focus()}}
                  // blurOnSubmit={false}


                  />
                </Item>
                <Item floatingLabel last style={{ padding: 10 }} >
                  <Label>Confirm Password</Label>
                  <Input
                    onChangeText={value => this.handleChange('rePassword', value)}
                    secureTextEntry
                    returnKeyType='go'
                    autoCapitalize='none'
                    ref={(input) => { this.passwordInput = input }}
                  />
                </Item>
                {this.state.error && <Text style={{ padding: 10, color: "red" }}> *{this.state.errorMessage}</Text>}

                <Button block style={{ padding: 10, color: "white" }} onPress={() => {
                  this.setState({
                    isLoading: true,
                  });
                  this.handleSubmit();
                }} >
                  <Text style={{ color: "white" }}>Change Password</Text>
                </Button>


              </Form>
            </View>
          </View>
          {this.state.isLoading && <View style={{
            backgroundColor: "rgba(12, 12, 12, .5)",
            position: "absolute", alignItems: "center", justifyContent: "center", flex: 1, width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}><Spinner color='blue' /></View>}

        </Modal>
        }
        {this.state.showMap && <Modal
          animationType="slide"
          transparent={true}
          style={{ backgroundColor: "red" }}
          backgroundColor={"grey"}
          visible={this.state.showMap}
          onRequestClose={() => {
            //Alert.alert('Modal has been closed.');
          }}>

          <View style={{ backgroundColor: "rgba(12, 12, 12, .5)", alignItems: "center", justifyContent: "center", flex: 1 }}>

            <MapView style={{
              backgroundColor: "red", width: Dimensions.get('window').width,
              height: Dimensions.get('window').height - 45,
            }}
            >

              {this.state.locations && this.state.locations.map(marker => (
                <Marker
                  coordinate={{ latitude: (marker.users[0].location ? marker.users[0].location.coordinates[0] : 0), longitude: (marker.users[0].location ? marker.users[0].location.coordinates[1] : 0) }}
                  title={marker.Name}
                  description={marker.Name}
                />
              ))}
            </MapView>

            <Button block style={{ padding: 10, color: "white" }} onPress={() => {
              this.setState({
                showMap: false,
              });
            }} >
              <Text style={{ color: "white" }}>Ok</Text>
            </Button>
          </View>
          {this.state.isLoading && <View style={{
            backgroundColor: "rgba(12, 12, 12, .5)",
            position: "absolute", alignItems: "center", justifyContent: "center", flex: 1, width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}><Spinner color='blue' /></View>}

        </Modal>
        }
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
    minWidth: 50,
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