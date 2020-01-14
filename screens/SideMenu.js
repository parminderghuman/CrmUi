import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';

class SideMenu extends Component {

  constructor() {
    super();
    this.state = {
      list: [],
      user: {}
    };

  }

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  componentDidMount() {
    this._bootstrapAsync();

  }
  _bootstrapAsync = async () => {
    var list = await AsyncStorage.getItem("UserEntities");
    var user = await AsyncStorage.getItem("User");
    
    list = JSON.parse(list)

    user = JSON.parse(user)
    
    this.setState({
      list: list,
      user: user
    })
    if (list && list.length > 0) {
      this.props.navigation.navigate('Home', {
        'system_tables': list[0]
      });
    }
  }
  render() {
    const { list, user } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              {user.email}
            </Text>
            {list.map((l, i) =>
              <View style={styles.navSectionStyle}>
                <Text style={styles.navItemStyle} onPress={(e) => {
                  // this.props.navigation.pop(1);

                  if (l.name == 'system_tables') {
                    this.props.navigation.navigate('TableListAdmin')
                  } else {
                    this.props.navigation.navigate('Home', {
                      'system_tables': l
                    })
                  }
                }

                }>
                  {l.name}
                </Text>
              </View>
            )}
          </View>

          <View>
            <Text style={styles.sectionHeadingStyle}>
              Logout
            </Text>

            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={(e) => {
                // this.props.navigation.pop(1);

                AsyncStorage.clear();
                this.props.navigation.navigate('Auth');

              }

              }>
                Settings
                </Text>
            </View>

          </View>

        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>This is my fixed footer</Text>
        </View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};


const styles = {
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
    padding: 20,
    backgroundColor: 'lightgrey'
  }
};
export default SideMenu;