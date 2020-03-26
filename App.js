import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Provider } from "react-redux";
import AppNavigator from './navigation/AppNavigator';
import store from './store';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

import { Root, Container, Text, StyleProvider } from 'native-base';
import * as Font from 'expo-font';
const client = axios.create({
  baseURL: 'http://localhost:8080/',
  responseType: 'json'
});
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
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
        <Root >
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <StyleProvider style={getTheme(material)}>
            <AppNavigator /></StyleProvider>
        </Root>
      </Provider>

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
      //'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
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

