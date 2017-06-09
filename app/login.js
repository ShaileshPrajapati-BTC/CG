import React,{Component} from 'react';
import { 
  Container, 
  Content, 
  Form,
  Item,
  Label,
  Input,
  Text,
  Button,
  Spinner,Header,Body,Title,Icon
} from 'native-base';

import {
  AsyncStorage,
  StatusBar,
  ToastAndroid,
  Platform,
  NativeAppEventEmitter,
  DeviceEventEmitter,
  Image,View,Alert,Dimensions
} from 'react-native';

import PushNotification from'react-native-push-notification';

import CONFIG from './config/config.js';

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobile: '',
      password: '',
      login: true,
      disabled: false
    };
  }

  async login(){
    var $this = this;
    this.setState({disabled: true})

    let response = await fetch(CONFIG.BASE_URL+'cargiver/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
      {
        mobile: this.state.mobile,
        password: this.state.password,
      })
    }).catch(function(error) {
      Alert.alert("Error", "Something went wrong please try again later!!");
      $this.setState({disabled: false});
    });
    try {
      let res = await response.json();
      console.log(res);
      if (res.status)
      {
        AsyncStorage.setItem('token', JSON.stringify(res.data.token));
        AsyncStorage.setItem('name', JSON.stringify(res.data.fullname));
        ToastAndroid.show(res.message,ToastAndroid.SHORT,ToastAndroid.CENTER,);
        PushNotification.localNotification ({
          message: "Dont Forget to enable Geo location.."
        });
        this._navigate('Scan','In');
      }
      else{
        this.setState({disabled: false});
        ToastAndroid.show(res.message,ToastAndroid.SHORT,ToastAndroid.CENTER,);
      }
    } catch(error) {
      Alert.alert("Error", "Something went wrong please try again later!!");
      console.log(error);
    }
  }

  _navigate(name) {
    this.props.navigator.push({
      name: name
    })
  }

  render() {
    return (
      <Container >
          <Content>
            <StatusBar
              backgroundColor="#4527a0"
              barStyle="light-content"
            />
             <Header>
                <Body>
                  <Title>Login</Title>
                </Body>
            </Header>
            <Image square  style={{alignSelf: 'center', marginTop:40}} source={require('./images/Logo.png')}  />
            <Form style={{ alignSelf: 'center',marginTop:20, width:300 }}>
              <Item >
                <Icon active name='ios-call' />
                <Input placeholder='Phone number' keyboardType="numeric" autoFocus = {true} onChangeText={(text) => {this.setState({mobile: text})}}/>
              </Item>
              <Item>
                <Icon active name='ios-lock'/>
                <Input placeholder='Password' secureTextEntry={true} onChangeText={(text) => {this.setState({password: text})}}/>
              </Item>
                <Button disabled={this.state.disabled} style={{backgroundColor: '#4527a0', alignSelf: 'center', marginTop: 25, marginBottom: 20,width:100 }} onPress={ () => this.login() }>
                  {(this.state.disabled)? <Spinner color='#ffffff' style={{marginLeft: 15}}/> : <Text style={{ marginLeft: 12}}>Login</Text>}
                </Button>
            </Form>
          </Content>
      </Container>
    );
  }
}