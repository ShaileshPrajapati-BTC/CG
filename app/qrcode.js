import React,{Component} from 'react';
import {
  Container,
  Content,
  Text, 
  Button
} from 'native-base';

import {View, 
  AsyncStorage, 
  ToastAndroid, 
  StyleSheet, 
  Dimensions,
  StatusBar,
  Alert,
  Platform
  } from 'react-native';
import Header from './components/back_header.js';   
import Camera from 'react-native-camera';
import CONFIG from './config/config.js';
import DropdownAlert from 'react-native-dropdownalert'

export default class Qrcode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: '',
      clock: false,
      camera: true
    };
  }

  componentWillMount () {
    this._getToken();
  }
  
  componentDidMount(){
    if (this.props.msg!=null){
      this.header._alert(this.props.msg);
    }
  }

  async _getToken(){
    AsyncStorage.getItem('token', (err, result) => {
       token= JSON.parse(result);
       console.log(token);
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

    try {
      let result = await response.json();
      console.log(result);
      if (result.status){
        AsyncStorage.setItem("client_id", JSON.stringify(qr_data.client_id));
        AsyncStorage.setItem("appointment_id", JSON.stringify(result.data.appointment));
        AsyncStorage.setItem("location", JSON.stringify(qr_data.location));
        AsyncStorage.setItem("scan_status", JSON.stringify(result.data.scan_status));
        AsyncStorage.setItem("clock_status", JSON.stringify(result.data.clock_status));
        AsyncStorage.setItem("in_out_status", JSON.stringify(result.data.in_out_status));
        // ToastAndroid.show(result.message, ToastAndroid.SHORT,ToastAndroid.CENTER);
        // this._alertPopup('Success', result.message);
        this._navigate('Scan',{status: 'success', message: result.message});
      }
      else{
        // ToastAndroid.show(result.message, ToastAndroid.SHORT,ToastAndroid.CENTER);
        // this._alertPopup('Error', result.message);
        this._navigate('Scan', {status: 'error', message: result.message});
      }
    } catch(error) {
      // this._alertPopup('Error', "Something went wrong please try again later!!");
      this.header._alert({status: 'error', message: CONFIG.something_went_wrong});
      console.log(error);
    }
  }

  
  async _onBarCodeRead(result) {
      var $this = this;
      if($this.state.camera) {
        $this.setState({camera: false});
        $this._scan_in_and_out_request(result.data);
      }
    }

  _navigate(name, msg_obj) {
    this.props.navigator.resetTo({
      name: name,
      passProps: {
        msg: msg_obj
      }
    })
  }

  _alertPopup(title, msg){
    Alert.alert(
      title,
      msg,
      [
        {text: 'OK'},
      ],
      { cancelable: false }
    )
  }

  render() {
    // this.barCodeFlag = true;
      return (
          <Container>
          <Header navigator={this.props.navigator} ref={(header) => { this.header = header; }}/>
            <Content>
              <StatusBar backgroundColor="#de6262" />
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

var height = (Platform.OS === 'ios') ? 60 : 80
var styles = StyleSheet.create({

  camera: {
    height: Dimensions.get("window").height - height,
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