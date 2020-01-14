import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,

} from 'react-native';


import API from "../api/entity-save";
import APILogin from "../api/login";
import * as LoginService from "../actions/login-actions";

export default class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    
    var result = await LoginService.fetchUserInformation()
    
    if(result === true){
      this.props.navigation.navigate('Home' )
    }else if(result === false){
      this.props.navigation.navigate('Auth' )
    }else{

    }
    
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}