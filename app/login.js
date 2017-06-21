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
  Image,View,Alert,Dimensions,StyleSheet,findNodeHandle,TextInput
} from 'react-native';

// import PushNotification from'react-native-push-notification';

import CONFIG from './config/config.js';

import {BlurView} from 'react-native-blurry';

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
        // PushNotification.localNotification ({
        //   message: "Dont Forget to enable Geo location.."
        // });
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

  imageLoaded() {
    this.setState({ viewRef: findNodeHandle(this.refs.backgroundImage) });
  }

  render() {
    return (
            <Image style={styles.container} ref={'backgroundImage'} source={{uri: 'http://pre12.deviantart.net/54fe/th/pre/i/2014/303/5/5/gradient_blur_abstract_hd_wallpaper_1920x1200_4426_by_satriohasmoro-d84o6ls.jpg'}} onLoadEnd={this.imageLoaded.bind(this)}  >
              <Container >
                <Content>
                  <StatusBar
                    backgroundColor="#de6262"
                    barStyle="light-content"
                  />
                  <Image square  style={{alignSelf: 'center',marginTop:100 }} source={require('./images/Logo.png')}  />
                  <Form style={{ alignSelf: 'center',marginTop:50, width:300}}>
                    
                    <Item style={{borderColor: "#E0E0E0",borderWidth:1, borderRadius:5,marginBottom:10}} >
                      <Icon active name='ios-call' style={{fontSize: 30, color: 'white', paddingLeft: 15}}/>
                      <Input placeholder='Phone number' placeholderTextColor="#E0E0E0" style={{fontSize: 20, color: 'white'}} keyboardType="numeric" autoFocus = {false} onChangeText={(text) => {this.setState({mobile: text})}}/>
                    </Item>
                    
                    <Item style={{borderColor: "#E0E0E0", borderWidth:1, borderRadius:5}} >
                      <Icon active name='ios-lock' style={{fontSize: 30, color: 'white', paddingLeft: 16}}/>
                      <Input placeholder='Password' placeholderTextColor="#E0E0E0" style={{fontSize: 20, color: 'white'}} secureTextEntry={true} onChangeText={(text) => {this.setState({password: text})}}/>
                    </Item>
                    
                      <Button disabled={this.state.disabled} style={{justifyContent:'center',borderColor:'#de6262', backgroundColor: '#de6262',borderRadius:10, marginTop: 25, marginBottom: 20, marginLeft:15,width:285,borderWidth:1 }} onPress={ () => this.login() }>
                        {(this.state.disabled)? <Spinner color='#ffffff'/> : <Text>Sign In</Text>}
                      </Button>
                  </Form>
                </Content>
              </Container>
            </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    resizeMode: 'cover',
    width: null,
    height: null,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: '#FFFFFF',
  },
  blurView: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  }
});