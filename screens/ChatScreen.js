import { GiftedChat } from 'react-native-gifted-chat'
import React from 'react';
import { ScrollView, StyleSheet, Button, Picker, View, Text, TouchableOpacity, TouchableHighlight, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import API from "../api/entity-save";
import * as  ChatApi from '../api/chat-api';

import KeyboardShift from '../utils/KeyboardShift'

import { Icon } from 'react-native-elements'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as  entityActions from '../actions/entity-action';
import { number } from 'prop-types';
import { apisAreAvailable } from 'expo';
import CustomMultiPicker from "react-native-multiple-select-list";
import MultiSelect from 'react-native-multiple-select';
import CustomPicker from "../components/CustomPicker";
import CustomSwitchWithLabel from '../components/CustomSwitchWithLabel';
import FloatingLabelInput from '../components/FloatingLabelInput';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class ChatScreen extends React.Component {
    state = {
        messages: [],
        user:{}
    };
    componentDidMount() {

        this.fetchData();
        this.setState({
            messages: [
                {
                    // _id: 1,
                    // text: "Hello developer",
                    // createdAt: new Date(),
                    // image: "http://primus.arts.u-szeged.hu/bese/bese.pdf",
                    // user: {
                    //     _id: 1,
                    //     name: "React Native",
                    //     // avatar: "https://placeimg.com/140/140/any",
                    // },
                },
            ],
        });
    }

    async fetchData() {
        const { navigation } = this.props
        var system_table = navigation.getParam("system_tables");
        var user = await AsyncStorage.getItem("User");

        var entity = navigation.getParam("entity");
        const token = await AsyncStorage.getItem('userToken')

        var resp = await ChatApi.FetchChat(token, entity._id, system_table._id);

        var resp = await resp.json();
        
         var messages = []; this.setState({
             messages: resp,
             user:JSON.parse(user)
         });

        // for(var i in resp){
        //     var mes= resp[i];
        //     var p = {
        //         _id:user._id,
        //         text:mes.text,
        //         createdAt:mes.createdAt
        //     };

        // }
    }
    async onSend(messages = []) {
        const { navigation } = this.props
        var system_table = navigation.getParam("system_tables");

        var entity = navigation.getParam("entity");
        const token = await AsyncStorage.getItem('userToken')
        
        var resp = await ChatApi.ChatSave(token, entity._id, system_table._id, { text: messages[0].text });
        var resp = await resp.json();
        
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }
    render() {
        return (
            <KeyboardShift>
                {() => (

                    <GiftedChat
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        user={this.state.user}
                    />
                )}
            </KeyboardShift>
        );
    }
}