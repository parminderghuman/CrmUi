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
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as LocationTracking from '../api/location-trackin'
export default class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();

   
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    var that = this;
    //this._handleBackGroundLocation();
    //await AsyncStorage.clear();
    var result = await LoginService.fetchUserInformation()
  
    if (result === true) {
   
        this.props.navigation.navigate('Home')
      // this.props.navigation.navigate('Auth')
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

  _handleBackGroundLocation = async() =>{
    const LOCATION_SETTINGS = {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 200,
      distanceInterval: 0,
    };
    
    var result = await TaskManager.isTaskRegisteredAsync('BACKGROUND_LOCATION_UPDATES_TASK')
    
    if(!result){
      TaskManager.defineTask('BACKGROUND_LOCATION_UPDATES_TASK',LocationTracking.TrackLocatiob)
    }
          
  }

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