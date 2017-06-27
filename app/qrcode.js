import React,{Component} from 'react';
import {
  Container,
  Content,
  Text, 
  Button,Spinner
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
import Permissions from 'react-native-permissions';

export default class Qrcode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: '',
      clock: false,
      camera: true,
      appointment_id: '',
      in_out_status: '',
      loading: false
    };
  }

  componentWillMount () {
    this._getToken();
    this._checkPermission();
  }
  
  componentDidMount(){
  }

  _navigate(name, msg_obj) {
    this.props.navigator.resetTo({
      name: name,
      passProps: {
        msg: msg_obj
      }
    })
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
      $this.header._alert({status: 'error', message: CONFIG.something_went_wrong});
    });;

    try {
      let result = await response.json();
      console.log(result);
      if (result.status){

        this.setState({
          appointment_id: JSON.stringify(result.data.appointment),
          in_out_status: JSON.stringify(result.data.in_out_status)
        });
        
        AsyncStorage.setItem("client_id", JSON.stringify(qr_data.client_id));
        AsyncStorage.setItem("location", JSON.stringify(qr_data.location));
        AsyncStorage.setItem("scan_status", JSON.stringify(result.data.scan_status));
        AsyncStorage.setItem("clock_status", JSON.stringify(result.data.clock_status));
        AsyncStorage.setItem("in_out_status", JSON.stringify(result.data.in_out_status));
        AsyncStorage.setItem("appointment_id", JSON.stringify(result.data.appointment));

        console.log(JSON.stringify(result.data.in_out_status)+'-------------out>');

        if (result.data.in_out_status == "In"){
          console.log(this.state.in_out_status+'------------->');
          this.header._alert({status: 'success', message: result.message});
          this._sendTodoList();
        }else{
          console.log(this.state.in_out_status+'-------------ddd>');
          this._navigate('Scan',{status: 'success', message: result.message});
        }
      }
      else{
        this._navigate('Scan', {status: 'error', message: result.message});
      }
      this.setState({loading: false});
    }catch(error) {
      this.header._alert({status: 'error', message: CONFIG.something_went_wrong});
      console.log(error);
    }
  }

  
  async _onBarCodeRead(result) {
    var $this = this;
    if($this.state.camera) {
      $this.setState({camera: false});
      $this.setState({loading: true});
      $this._scan_in_and_out_request(result.data);
    }
  }
  
  async _sendTodoList(){

    let response = await fetch(CONFIG.BASE_URL+'todolist/update', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'access_token': this.state.token
      },
      body: JSON.stringify(
      {
        appointment_id: this.state.appointment_id,
        todo_list: this.props.picker_state,
        extra_milage: this.props.extra_milage,
        injury_status: this.props.injury_status
      })
    }).catch(function(error) {
      // this._alertPopup('Error', "Something went wrong please try again later!!");
      this.header._alert({status: 'error', message: CONFIG.something_went_wrong});
    });
    try {
      let res = await response.json();
      console.log(res);
      if (res.status)
      {
        this._navigate('Scan', {status: 'success', message: res.message});
      }
      else{
        this.header._alert({status: 'error', message: res.message});
      }
    } catch(error) {
      this.header._alert({status: 'error', message: CONFIG.something_went_wrong});
    }
  }

  _openSettings() {
    Permissions.openSettings()
    this._navigate('Scan');
  }

  _cancel(){
    this._navigate('Scan');
  }

  _checkPermission() {
    Permissions.getPermissionStatus('camera')
      .then(response => {
        if (response != 'authorized'){
          Alert.alert(
            'Evv would like to use Your Camera.',
            "Evv use camera to scan Qr-code, Please enable it from settings.",
            [
              {text: 'Cancel', style: 'cancel', onPress: this._cancel.bind(this)},
              {text: 'Open Settings', onPress: this._openSettings.bind(this) },
            ]
          )
        }else{
          this.setState({loading: true});
        }
    });
  }
  
  render() {
    // this.barCodeFlag = true;
      return (
          <Container>
          <Header navigator={this.props.navigator} ref={(header) => { this.header = header; }}/>
            <StatusBar backgroundColor="#de6262" />  
              {(this.state.loading)? 
                <Content>
                  <Camera onBarCodeRead={this._onBarCodeRead.bind(this)} style={styles.camera} >
                    <View style={styles.rectangleContainer}>
                      <View style={styles.rectangle}/>
                    </View>
                  </Camera>
                </Content>
               :<Content contentContainerStyle={{flex: 1, justifyContent: 'center',alignItems: 'center'}}><Spinner color='#de6262'/><Text style={{color: '#de6262'}}>Please wait...</Text></Content>}
        </Container>
      );
  }
}

var height = (Platform.OS === 'ios') ? 60 : 78
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