import React,{Component} from 'react';
import {
  Container,
  Content,
  Text, 
  Button
} from 'native-base';

import {View, ToastAndroid,StyleSheet} from 'react-native';
import Header from './components/header.js';   
import Camera from 'react-native-camera';

export default class Qrcode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: true
    };
  }

  componentDidMount(){
    setTimeout( () => {
      this.setState({data: false})
    },1000);
    
  }

  _onBarCodeRead(result) {
      var $this = this;
      
      if (this.barCodeFlag) {
        this.barCodeFlag = false;
        setTimeout(function() {
          ToastAndroid.show(result.data,ToastAndroid.SHORT,ToastAndroid.CENTER,);
          $this.props.navigator.pop();
        }, 500);
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