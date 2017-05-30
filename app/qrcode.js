import React,{Component} from 'react';
import {
  Container,
  Content,
  Text, 
  Button
} from 'native-base';

import {View, AsyncStorage, ToastAndroid, StyleSheet} from 'react-native';
import Header from './components/header.js';   
import Camera from 'react-native-camera';
import CONFIG from './config/config.js';

export default class Qrcode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: '',
      data: true,
      result: ''
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

  async _scan_in_and_out_request(id){

    let response = await fetch(CONFIG.BASE_URL+'qrcode/scan', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'access_token': this.state.token
      },
      body: JSON.stringify(
      {
        patient_id: id,
      })
    });

    let result = await response.json();
    console.log(result);
    if (result.status){
      AsyncStorage.setItem("scan_status", JSON.stringify(result.data.scan_status));
      ToastAndroid.show(result.message+"true", ToastAndroid.SHORT,ToastAndroid.CENTER);
    }
    else{
      ToastAndroid.show(result.message+"false", ToastAndroid.SHORT,ToastAndroid.CENTER);
    }
  }

  
  async _onBarCodeRead(result) {
      var $this = this;
      
      if (this.barCodeFlag) {
        this.barCodeFlag = false;
        setTimeout(function() {
          $this._scan_in_and_out_request(result.data);
          $this.props.navigator.pop();
        }, 200);
      }
    }

  render() {
    this.barCodeFlag = true;
      return (
          <Container>
            <Content>
              <Camera onBarCodeRead={this._onBarCodeRead.bind(this)} style={styles.camera} >
                <View style={styles.rectangleContainer}>
                  <View style={styles.rectangle}/>
                </View>
              </Camera>
              <Button block onPress={()=> this.props.navigator.pop()} style={{ backgroundColor:'#4527a0', alignSelf: 'center',top: 2}}>
                <Text style={{ alignSelf: 'center'}}>Cancel</Text>
              </Button>
          </Content>
        </Container>
      );
  }
}

var styles = StyleSheet.create({

  camera: {
    height: 568,
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