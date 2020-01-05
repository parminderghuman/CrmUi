import React from 'react';

import { Platform , Dimensions} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import TableScreen from '../screens/TableScreen';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CreateTableScreen from '../screens/CreateTableScreen';
import { DrawerNavigator ,StackNavigator} from 'react-navigation';
import SideMenu from "../screens/SideMenu";
import { createDrawerNavigator } from 'react-navigation-drawer';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = 'Home';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

LinksStack.path = 'Links';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = 'Settings';
const TableScreenStack = createStackNavigator(
  {
    TableScreen: TableScreen,
   // CreateTable : createStackNavigator({ CreateTable: {screen:CreateTableScreen, navigationOptions:{header:null}} })
  },
  config,
  
);

TableScreenStack.navigationOptions = {
  tabBarLabel: 'CreateTable',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

TableScreenStack.path = 'TableListAdmin';
const sn =  createStackNavigator({
  HomeStack:{screen:HomeStack,navigationOptions:{header:null}},
  LinksStack:{screen:LinksStack,navigationOptions:{header:null}},
  SettingsStack:{screen:SettingsStack,navigationOptions:{header:null}},
  TableScreenStack:{screen:TableScreenStack,navigationOptions:{header:null}},
},{
 
});
const tabNavigator = createDrawerNavigator({sn: {screen:sn ,navigationOptions:{header:null}}
},{
  contentComponent: SideMenu,
  drawerWidth: Dimensions.get('window').width - 120,  
 
});

tabNavigator.path = '';

export default tabNavigator;
