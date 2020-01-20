import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Provider } from "react-redux";
import { mapping, light as lightTheme } from '@eva-design/eva';

import axiosMiddleware from 'redux-axios-middleware';
import AppNavigator from './navigation/AppNavigator';
import LoginScreen from './screens/LoginScreen';
import store from './store';

const client = axios.create({
  baseURL: 'http://localhost:8080/',
  responseType: 'json'
});

//const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));


export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);


  if (!isLoadingComplete && !props.skipLoadingScreen) {

    return (<AppLoading
      startAsync={loadResourcesAsync}
      onError={handleLoadingError}
      onFinish={() => handleFinishLoading(setLoadingComplete)}
    />)
  } else {

    return (
    
    <Provider store={store}> 
     

      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View></Provider>
     
      )
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      //...Ionicoos material themens.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
