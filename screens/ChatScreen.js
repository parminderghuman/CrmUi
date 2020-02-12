import { GiftedChat } from 'react-native-gifted-chat'
import React from 'react';
import { ScrollView, StyleSheet, Button, Picker, View, Text, TouchableOpacity, TouchableHighlight, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import API from "../api/entity-save";
import chatApi, * as  ChatApi from '../api/chat-api';
import { Avatar } from 'react-native-elements';

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
        user: {}
    };
    static navigationOptions = ({ navigation, state, props }) => ({
        title: navigation.getParam('Title'),
        headerStyle: {
            backgroundColor: '#352e4a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerRight: () => (
            <View style={{
                flex: 1,
                flexDirection: 'row',
            }}>


                <Icon
                    onPress={() => {
                        try {
                            navigation.getParam('addChat')();
                        } catch (e) {

                        }

                    }}
                    style={{
                        flex: 1,
                        margin: 8,
                    }}
                    type="font-awesome"
                    color="#fff"
                    name="plus"
                />
                <Text>  </Text>
                <Icon
                    onPress={() => {
                        try {
                            navigation.getParam('refreshData')();
                        } catch (e) {
                            console.log(e)
                        }

                    }}
                    color="#fff"

                    style={{
                        flex: 1,
                        margin: 8,
                    }}
                    type="font-awesome"
                    name="refresh"
                />
                <Text>  </Text>

            </View>
        ),
        headerLeft: () => (
            <View style={{
                flex: 1,
                flexDirection: 'row',

            }}>
                <Icon
                    onPress={() => { navigation.goBack() }}
                    style={{
                        flex: 1,
                        margin: 8,
                    }}
                    type="font-awesome"
                    color="#fff"

                    name="arrow-left"
                />
                <Text> </Text>
                {navigation.getParam('icon') &&

                    <Icon
                        onPress={() => navigation.openDrawer()}

                        type="font-awesome"

                        name={navigation.getParam('icon') + ""}
                        color="#fff"
                    />
                }
                {!navigation.getParam('icon') &&
                    <Avatar source={{ uri: 'Image URL' }} rounded title={navigation.getParam('Title')? navigation.getParam('Title')[0]:''} />

                }
              
            </View>
        ),
    });

    componentDidMount() {

        this.fetchData();
        this.setState({
            messages: [
                //  {
                // _id: 1,
                // text: "Hello developer",
                // createdAt: new Date(),
                // image: "http://primus.arts.u-szeged.hu/bese/bese.pdf",
                // user: {
                //     _id: 1,
                //     name: "React Native",
                //     // avatar: "https://placeimg.com/140/140/any",
                // },
                //  },
            ],
        });
    }

    async fetchData() {

        const { navigation } = this.props

        const token = await AsyncStorage.getItem('userToken')

        var system_table = navigation.getParam("system_tables");
        var user = await AsyncStorage.getItem("User");
        var chat = navigation.getParam("chat");
        var entityId = navigation.getParam("entityId");
        var entityClass = navigation.getParam("entityClass");

        if (typeof (chat) != "undefined") {
            var respChat = await ChatApi.FetchChat(token, chat.id, {});
        } else {
            var respChat = await ChatApi.FetchChatbyEntity(token, entityId, entityClass, {});
        }


        var respChat = await respChat.json();

        if (respChat.type == "Entity") {
            var resp = await ChatApi.FetchMessageByEntity(token, respChat.id, {});
            var resp = await resp.json();
        } else {
            var resp = await ChatApi.FetchMessage(token, respChat.id, {});
            var resp = await resp.json();
        }
        var messages = [];
        debugger
        for (var i in resp) {
            if (resp[i].message) {

                resp[i].user.name = resp[i].user.Name
                resp[i].message.user = resp[i].user
                messages.push(resp[i].message)

            } else {
                resp[i].user.name = resp[i].user.Name
                resp[i].user = resp[i].user
                messages.push(resp[i])
            }
        }
        user = JSON.parse(user)


        this.setState({
            messages: messages,
            user: user,
            chat: respChat
        });
    }
    async onSend(messages = []) {
        const { navigation } = this.props
        var system_table = navigation.getParam("system_tables");
        var chat = navigation.getParam("chat");
        var entity = navigation.getParam("entity");
        const token = await AsyncStorage.getItem('userToken')
        debugger
        var resp = await ChatApi.ChatSave(token, this.state.chat.id, { text: messages[0].text });
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
                        user={this.state.user.activeCompany}
                    />
                )}
            </KeyboardShift>
        );
    }
}