import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Alert

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
    var that = this;
    var result = await LoginService.fetchUserInformation()

    if (result === true) {
      this.props.navigation.navigate('Home')
    } else if (result === false) {
      this.props.navigation.navigate('Auth')
    } else {
      Alert.alert(
        'Network Error',
        result,
        [
          {
            text: 'Retry', onPress: () => {
              that._bootstrapAsync()
            }
          },
        ],
        { cancelable: false },
      );
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