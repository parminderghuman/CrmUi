import React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import { bindActionCreators } from "redux";

import { connect } from 'react-redux';
import { ExpoLinksView } from '@expo/samples';
import * as LoginService from "../actions/login-actions";

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
    debugger
    if (resp === true) {
      this.props.navigation.navigate('Home');
    } else if (resp == false) {
      Alert.alert(
        'Login Failed',
        'Login failed wrong user credentials.',
        [
          {
            text: 'Ok', onPress: () => {

            }
          },
        ],
        { cancelable: false },
      );
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
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Enter your name and password:</Text>
        <TextInput
          onChangeText={value => this.handleChange('name', value)}
          returnKeyType='next'
          keyboardType='email-address'
          autoCorrect={false}
          onSubmitEditing={() => this.passwordInput.focus()}
          style={styles.input}
        />
        <TextInput
          onChangeText={value => this.handleChange('password', value)}
          secureTextEntry
          returnKeyType='go'
          autoCapitalize='none'
          style={styles.input}
          ref={input => this.passwordInput = input}
        />
        <TouchableOpacity
          onPress={this.handleSubmit}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
    width: '100%'
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