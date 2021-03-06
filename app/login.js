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
  Image,View,Alert,
  Dimensions,StyleSheet,
  findNodeHandle,TextInput
} from 'react-native';

// import PushNotification from'react-native-push-notification';

import CONFIG from './config/config.js';
import DropdownAlert from 'react-native-dropdownalert'


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

  _validate(){
    if (this.state.mobile.length == 0){
      this.dropdown.alertWithType('error', 'Error', CONFIG.mobile);
    }else if (this.state.mobile.length < 10 ){
      this.dropdown.alertWithType('error', 'Error', CONFIG.invalid_mobile);
    }else if (this.state.password.length ==0){
      this.dropdown.alertWithType('error', 'Error', CONFIG.password);
    }else{
      this.login();
    }
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
      this.dropdown.alertWithType('error', 'Error', CONFIG.something_went_wrong);
      $this.setState({disabled: false});
    });
    try {
      let res = await response.json();
      console.log(res);
      if (res.status)
      {
        AsyncStorage.setItem('token', JSON.stringify(res.data.token));
        AsyncStorage.setItem('name', JSON.stringify(res.data.fullname));
        AsyncStorage.setItem("supervisor_name", JSON.stringify(res.data.supervisor_name));
        if (res.data.scan_status!=null){
          AsyncStorage.setItem("scan_status", JSON.stringify(res.data.scan_status));
          AsyncStorage.setItem("clock_status", JSON.stringify(res.data.clock_status));
          AsyncStorage.setItem("in_out_status", JSON.stringify(res.data.in_out_status));
          AsyncStorage.setItem("appointment_id", JSON.stringify(res.data.appointment));
        }
        // ToastAndroid.show(res.message,ToastAndroid.SHORT,ToastAndroid.CENTER,);
        // PushNotification.localNotification ({
        //   message: "Dont Forget to enable Geo location.."
        // });
        this._navigate('Scan',{status: 'success', message: res.message});
      }
      else{
        this.setState({disabled: false});
        this.dropdown.alertWithType('error', 'Error', res.message);
      }
    } catch(error) {
      this.dropdown.alertWithType('error', 'Error', CONFIG.something_went_wrong);
      this.setState({disabled: false});
      console.log(error);
    }
  }

  _navigate(name, msg_obj) {
    this.props.navigator.push({
      name: name,
      passProps: {
        msg: msg_obj
      }
    })
  }

  render() {
    return (
        <Container >
          <Content scrollEnabled={false} contentContainerStyle={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
            <StatusBar backgroundColor="#de6262"/>
            <Image square  style={{alignSelf: 'center', width:300, height:60 }} source={require('./images/Logoo.png')}  />
            <Form style={{ alignSelf: 'center',marginTop:50, width:300}}>
              
              <Item style={{borderColor: "#E0E0E0",borderWidth: 1, borderRadius:5,marginBottom:10}} >
                <Icon active name='ios-call' style={{fontSize: 30, paddingLeft: 15}}/>
                <Input maxLength={10} placeholder='Phone number' placeholderTextColor="#E0E0E0" style={{fontSize: 20}} keyboardType="numeric" autoFocus = {false} onChangeText={(text) => {this.setState({mobile: text})}}/>
              </Item>
              
              <Item style={{borderColor: "#E0E0E0", borderWidth:1, borderRadius:5}} >
                <Icon active name='ios-lock' style={{fontSize: 30, paddingLeft: 16}}/>
                <Input placeholder='Password' placeholderTextColor="#E0E0E0" style={{fontSize: 20}} secureTextEntry={true} onChangeText={(text) => {this.setState({password: text})}}/>
              </Item>
              
                <Button disabled={this.state.disabled} style={{justifyContent:'center',borderColor:'#de6262', backgroundColor: '#de6262',borderRadius:10, marginTop: 25, marginBottom: 20, marginLeft:15,width:285,borderWidth:1 }} onPress={ () => this._validate() }>
                  {(this.state.disabled)? <Spinner color='#ffffff'/> : <Text>Sign In</Text>}
                </Button>
            </Form>
          </Content>
          <DropdownAlert ref={(ref) => this.dropdown = ref} updateStatusBar={false}/>
        </Container>
    );
  }
}