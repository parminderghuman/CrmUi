import React, { Component } from 'react';
import { View, StatusBar, TextInput, Text, Animated ,Switch} from 'react-native';

export default class CustomSwitchWithLabel extends Component {
    state = {
        isFocused: false,
    };



    render() {
        const { text, ...props } = this.props;
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text >
                    {text}
                </Text>
                <Switch 
                    {...props}
                />
            </View>);

    }
}


