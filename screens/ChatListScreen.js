import { GiftedChat } from 'react-native-gifted-chat'
import React from 'react';
import { ScrollView, StyleSheet, Picker, View, TouchableOpacity, TouchableHighlight, Modal, AsyncStorage, FlatList } from 'react-native';
import { Container, Thumbnail, Header, Content, Form, Item, Switch, Input, Label, Button, Text, Toast, ListItem, List, Left, Body, Right, Separator } from 'native-base';
import { Avatar } from 'react-native-elements';

import { ExpoLinksView } from '@expo/samples';
import API from "../api/entity-save";
import * as  ChatApi from '../api/chat-api';
import * as  Api from '../api/entity-save';

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

export default class ChatListScreen extends React.Component {

    constructor() {
        super();
        this.addChat = this.addChat.bind(this)
        this.startNewChat = this.startNewChat.bind(this)
        this.navigateToChatScreen = this.navigateToChatScreen.bind(this)
    }
    state = {
        messages: [],
        user: {},
        fetchingUsersLoading: false,
        customPicker: false,
        sUser: undefined,
        isLoading: false
    };
    async navigateToChatScreen(chat, username, icon) {
        const { navigation } = this.props
        navigation.navigate('ChatScreen', {
            'chat': chat,
            "Title": username,
            entityId: undefined,
            entityClass: undefined, icon: icon


        })
    }
    async startNewChat() {
        const token = await AsyncStorage.getItem('userToken')

        var resp = await Api.startNewChat(token, this.state.sUser)
        var resp = await resp.json();

        var user = await AsyncStorage.getItem("User");
        user = JSON.parse(user)
        var targetUser = null;
        for (var i in resp.users) {
            if (user._id != resp.users[i]._id) {
                targetUser = resp.users[i]
                break;
            }
        }
        const { navigation } = this.props
        this.navigateToChatScreen(resp, targetUser.Name)

    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    componentDidMount() {

        const { navigation } = this.props

        this.focusListener = navigation.addListener("didFocus", () => {
            this.fetchData();
        });


        this.fetchData();



        navigation.setParams({
            addChat: this.addChat,
            refreshData: this.refreshData,

        })
    }
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
                    style={{
                        flex: 1,
                        margin: 8,
                    }}
                    type="font-awesome"
                    name="refresh"
                    color="#fff"
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
                    onPress={() => navigation.openDrawer()}

                    type="font-awesome"

                    name="bars"
                    color="#fff"
                />
                <Text> </Text>
                <Icon
                    onPress={() => navigation.openDrawer()}

                    type="font-awesome"

                    name={navigation.getParam('TitleIcon') + ""}
                    color="#fff"
                />

            </View>
        ),
    });
    async fetchData(i = 0) {
        debugger
        const { navigation } = this.props
        var system_table = navigation.getParam("system_tables");
        var user = await AsyncStorage.getItem("User");

        var entity = navigation.getParam("entity");
        const token = await AsyncStorage.getItem('userToken')
        var query = {};
        try {


            if (i == -1) {
                var a = new Date(this.state.messages[this.state.messages.length - 1].updatedAt);
                query['updatedAt'] = { '$lt': a.getTime() }
            } if (i == 1) {
                var a = new Date(this.state.messages[0].updatedAt);
                query['updatedAt'] = { '$gt': a.getTime() }
            }
        } catch (error) {
            i = 0
        }

        query = encodeURI(JSON.stringify(query))
        var sort = { 'updatedAt': 'desc' };
        sort = encodeURI(JSON.stringify(sort));
        var parama = { "query": query, "sort": sort }
        var resp = await ChatApi.FetchChatList(token, parama);

        var resp = await resp.json();
        if (i == -1) {
            this.state.messages = resp.concat(this.state.messages);

        } else if (i == 1) {
            this.state.messages = this.state.messages.concat(resp);

        } else {
            this.state.messages = resp
        }

        this.setState({
            messages: this.state.messages,
            user: JSON.parse(user)
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

    async addChat() {
        const token = await AsyncStorage.getItem('userToken')
        var params = {};

        const { navigation } = this.props

        const parent = navigation.getParam("parent");

        var query = {};

        if (parent) {
            query = { "parent_id": { "$oid": parent._id } };
        }


        query = encodeURI(JSON.stringify(query))
        var sort = { 'updateAt': 'desc' };
        sort = encodeURI(JSON.stringify(sort));
        var parama = { "query": query, "sort": sort }
        var resp = await Api.FetchEntities(token, "User", params);
        var resp = await resp.json();

        this.setState({
            users: resp,
            customPicker: true,
            sUser: undefined
        })
    }
    render() {
        return (
            <KeyboardShift>
                {() => (

                    <Container>

                        <FlatList

                            data={this.state.messages}
                            onRefresh={() => {
                                this.fetchData(-1);
                            }}
                            onEndReached={(info) => {
                                debugger
                                this.fetchData(1);
                            }}
                            onEndReachedThreshold={0.5}
                            refreshing={this.state.isLoading}
                            renderItem={data => {
                                var message = data.item;
                                return <ListItem avatar onPress={() => {

                                    this.navigateToChatScreen(message.chat, message.user ? message.user.Name : message.chat.name, message.entity ? message.entity.icon : undefined)

                                }}>
                                    <Left>
                                        {

                                            message.chat.type == "Entity" ? <Icon type="font-awesome" name={message.entity.icon} />
                                                : <Avatar source={{ uri: 'Image URL' }} rounded title={message.user && message.user.Name ? message.user.Name[0] : message.chat.name[0]} />
                                        }
                                    </Left>
                                    <Body>
                                        <Text>{message.user ? message.user.Name : message.chat.name}</Text>
                                        <Text note>{message.message ? message.message.text : ""}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>{new Date(message.lastMessageTime).toLocaleString()}</Text>
                                    </Right>
                                </ListItem>
                            }}
                        >

                        </FlatList>

                        {this.state.customPicker && this.state.users &&

                            <CustomPicker
                                options={this.state.users}

                                selectedValue={this.state.sUser}
                                display={"Name"}
                                search={true} // should show search bar?
                                multiple={false} //
                                selected={this.state.sUser}
                                selectedIconName={"ios-checkmark-circle"}
                                unselectedIconName={"ios-checkmark-circle-outline"}
                                returnValue={"_id"}
                                callback={(itemValue) => {

                                    try {
                                        for (var i in itemValue) {

                                            if (typeof (itemValue[i]) == "undefined") {

                                                itemValue.splice(i, 1)
                                            }
                                        }
                                        this.setState({ sUser: itemValue[0] })
                                    }
                                    catch (e) { }
                                }
                                }
                                onDone={(e) => {
                                    this.setState({
                                        customPicker: false,

                                    })
                                    this.startNewChat();
                                }}
                            >
                            </CustomPicker>
                        }
                    </Container>
                )}
            </KeyboardShift>
        );
    }
}