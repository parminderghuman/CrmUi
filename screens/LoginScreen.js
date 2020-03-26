import React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Toast } from 'native-base';

import { bindActionCreators } from "redux";

import { connect } from 'react-redux';
import { ExpoLinksView } from '@expo/samples';
import * as LoginService from "../actions/login-actions";
import KeyboardShift from '../utils/KeyboardShift'

class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      password: ''
    };
 
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(type, value) {
    this.setState({ [type]: value });
  }

  async handleSubmit() {

    var that = this;
    var resp = await LoginService.loginUserMain(this.state.name, this.state.password)
    // loginUser.

    if (resp === true) {


      this.props.navigation.navigate('Home');
    } else if (resp == false) {
      // Alert.alert(
      //   'Login Failed',
      //   'Login failed wrong user credentials.',
      //   [
      //     {
      //       text: 'Ok', onPress: () => {

      //       }
      //     },
      //   ],
      //   { cancelable: false },
      // );
      Toast.show({
        text: "Login failed, Wrong user credentials!",
      })
    } else {

      Alert.alert(
        'Network Error',
        resp,
        [{
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Retry', onPress: () => {
            that.handleSubmit();
          }
        },
        ],
        { cancelable: false },
      );
    }

    //this.props.navigation.navigate( 'Home');
  };

  componentWillReceiveProps(nextProps) {


  }


  render() {

    var _this = this;
    return (

      <KeyboardShift>
        {() => (
          <Container style={styles.container}>
            <Content contentContainerStyle={styles.container}>
              <Form>
                <Item floatingLabel style={{ padding: 10 }}>
                  <Label>Username</Label>
                  <Input
                    onChangeText={value => this.handleChange('name', value)}
                    returnKeyType='next'
                    keyboardType='email-address'
                    type={"email"}
                    autoCorrect={false}
                    returnKeyType="next"

                   // onSubmitEditing={() => { _this.passwordInput._root.focus() }}
                  // blurOnSubmit={false}


                  />
                </Item>
                <Item floatingLabel last style={{ padding: 10 }} >
                  <Label>Password</Label>
                  <Input
                    onChangeText={value => this.handleChange('password', value)}
                    secureTextEntry
                    returnKeyType='go'
                    autoCapitalize='none'
                    ref={(c) =>  _this.passwordInput = c}
                    onSubmitEditing={_this.handleSubmit}
                  />
                </Item>

                <Button block style={{ padding: 10, color: "white" }} onPress={this.handleSubmit} >
                  <Text style={{ color: "white" }}>Login</Text>
                </Button>


              </Form>
            </Content>
          </Container>
        )}</KeyboardShift>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fffFF0',
    height: '100%',
    width: '100%',
    flex: 1, padding: 10,

  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    width: '90%',
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: '#fff',
    color: '#000',
    textAlign: 'center',
    marginTop: 10
  },
  button: {
    width: '75%',
    backgroundColor: 'blue',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 15
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  }
});
const mapStateToProps = state => ({
  token: state.loginReducer.token,
  isauthenticated: state.loginReducer.isauthenticated,
  error: state.loginReducer.error
});


const mapDispatchToProps = dispatch => {
  return bindActionCreators({

  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);