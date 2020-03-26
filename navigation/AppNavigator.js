import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';
import CreateTableScreen from '../screens/CreateTableScreen';
import PermissionsScreen from '../screens/PermissionsScreen';

import CreatEntityScreen from '../screens/CreatEntityScreen';
import EntityList from '../screens/EntityList';

import LoginScreen from '../screens/LoginScreen';
import ChatScreen  from '../screens/ChatScreen';
import ChatListScreen  from '../screens/ChatListScreen';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
const AuthStack = createStackNavigator({ SignIn:{screen:  LoginScreen , navigationOptions:{header:null}}});
//const CreateTable = createStackNavigator({ CreateTable: CreateTableScreen });
export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: createStackNavigator({MainTabNavigator:{screen:MainTabNavigator,navigationOptions:{header:null}},
      CreateTable:{screen:CreateTableScreen},
      CreateEntity:{screen:CreatEntityScreen},   
      PermissionsScreen:{screen:PermissionsScreen}, 
      ChatScreen:{screen:ChatScreen}, 
      
     // EntityList:{screen:EntityList}
    } ),
   
    //CreateTable:CreateTableScreen,

  },
  {
    initialRouteName: 'AuthLoading',
  }
  )
);
