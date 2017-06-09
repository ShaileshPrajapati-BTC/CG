import React,{Component} from 'react';
import {
  Container,
  Content,
  Text, 
  Button
} from 'native-base';

import {View, AsyncStorage, ToastAndroid, StyleSheet, Dimensions} from 'react-native';
import Header from './components/back_header.js';   
import Camera from 'react-native-camera';
import CONFIG from './config/config.js';

export default class Qrcode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: '',
      clock: false
    };
  }

  componentWillMount () {
    this._getToken();
  }
  
  componentDidMount(){
    setTimeout( () => {
      this.setState({data: false})
    },1000);
    
  }

  async _getToken(){
    AsyncStorage.getItem('token', (err, result) => {
       token= JSON.parse(result)
       if (result!=null){
          this.setState({token: token});
       }
    });
  }

  async _scan_in_and_out_request(qr_data){
    qr_data = JSON.parse(qr_data);
    console.log(qr_data);
    let response = await fetch(CONFIG.BASE_URL+'qrcode/scan', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'access_token': this.state.token
      },
      body: JSON.stringify(
      {
        client_id: qr_data.client_id,
      })
    }).catch(function(error) {
      Alert.alert("Error", "Something went wrong please try again later!!");
    });;

    let result = await response.json();
    console.log(result);
    if (result.status){
      AsyncStorage.setItem("client_id", JSON.stringify(qr_data.client_id));
      AsyncStorage.setItem("appointment_id", JSON.stringify(result.data.appointment));
      AsyncStorage.setItem("location", JSON.stringify(qr_data.location));
      AsyncStorage.setItem("scan_status", JSON.stringify(result.data.scan_status));
      AsyncStorage.setItem("clock_status", JSON.stringify(result.data.clock_status));
      AsyncStorage.setItem("in_out_status", JSON.stringify(result.data.in_out_status));
      ToastAndroid.show(result.message, ToastAndroid.SHORT,ToastAndroid.CENTER);
    }
    else{
      ToastAndroid.show(result.message, ToastAndroid.SHORT,ToastAndroid.CENTER);
    }
    this.props.type._setStatus();
  }

  
  async _onBarCodeRead(result) {
      var $this = this;
      
      if (this.barCodeFlag) {
        this.barCodeFlag = false;
        setTimeout(function() {
          $this._scan_in_and_out_request(result.data);
          // $this.props.type._setStatus();
          $this.props.navigator.pop();
        }, 200);
      }
    }

  _navigate(name) {
    this.props.navigator.push({
      name: name
    })
  }

  render() {
    this.barCodeFlag = true;
      return (
          <Container>
          <Header navigator={this.props.navigator} emergency_icon={true}/>
            <Content>
              <Camera onBarCodeRead={this._onBarCodeRead.bind(this)} style={styles.camera} >
                <View style={styles.rectangleContainer}>
                  <View style={styles.rectangle}/>
                </View>
              </Camera>
          </Content>
        </Container>
      );
  }
}

var styles = StyleSheet.create({

  camera: {
    height: Dimensions.get("window").height - 80,
    alignItems: 'center',
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  }
});