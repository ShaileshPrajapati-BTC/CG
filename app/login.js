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
  Spinner
} from 'native-base';

import {
  AsyncStorage,
  StatusBar,
  ToastAndroid,
  Platform,
  NativeAppEventEmitter,
  DeviceEventEmitter
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';
import PushNotification from'react-native-push-notification';

import CONFIG from './config/config.js';

const EventEmitter = Platform.select({
  ios: () => NativeAppEventEmitter,
  android: () => DeviceEventEmitter,
})();



export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobile: '',
      password: '',
      login: true
    };
  }
  componentDidMount(){
    this.checkLogin();
    // console.log('toke');
    // const intervalId = BackgroundTimer.setInterval(() => {
    //   console.log('tic');
    //   }, 200);
  }
  
  async checkLogin(){
    AsyncStorage.getItem('token', (err, result) => {
      current_user= JSON.parse(result)
      if (result!=null){
        this._navigate('Scan','In');
      }
      else
      {
        this.setState({login: false});
      }
    });
  }

  async login(){
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
    });

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
      ToastAndroid.show(res.message,ToastAndroid.SHORT,ToastAndroid.CENTER,);
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
        {(this.state.login)? <Content style={{top:200}}><Spinner color='#2196F3'/></Content>:
          <Content>
            <StatusBar
              backgroundColor="#4527a0"
              barStyle="light-content"
            />
            <Form style={{ alignSelf: 'center', marginTop: 180, marginBottom: 20,width:300 }}>
              <Item floatingLabel>
                <Label>Phone number</Label>
                <Input keyboardType="numeric" autoFocus = {true} onChangeText={(text) => {this.setState({mobile: text})}}/>
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input secureTextEntry={true} onChangeText={(text) => {this.setState({password: text})}}/>
              </Item>
                <Button style={{ backgroundColor:'#4527a0', alignSelf: 'center', marginTop: 20, marginBottom: 20,width:100 }} onPress={ () => this.login() }>
                  <Text style={{ marginLeft: 12}}>Login</Text>
                </Button>
            </Form>
          </Content>
        }
      </Container>
    );
  }
}