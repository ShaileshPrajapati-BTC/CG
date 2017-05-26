import React,{Component} from 'react';
import { 
  Container, 
  Content,
  Text,
  Button
} from 'native-base';

import {Image, AsyncStorage} from 'react-native';       
import Header from './components/header.js';
import PushNotification from'react-native-push-notification';

export default class Scan extends Component {

  constructor(props) {
    super(props);

  }
  
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        console.log(initialPosition);
        alert(initialPosition);
      },
      (error) =>  PushNotification.localNotification ({
                    message: "Please Enable Location"
                  }),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    );
  }

  _navigate(name, type) {
    this.props.navigator.push({
      name: name,
      passProps: {
        type: type
      }
    })
  }

  render() {
    return (
      <Container>
        <Header navigator={this.props.navigator}/>
          <Content padder>
            <Image square  style={{ alignSelf: 'center',height:200,width:200, marginTop: 50 }} source={require('./images/qrcode.jpg')}  />
            <Button  onPress={()=> this._navigate('Qrcode', 'in')} style={{ backgroundColor:'#4527a0', alignSelf: 'center', marginTop: 100, marginBottom: 20,width:100 }}>
              <Text style={{ alignSelf: 'center', marginLeft: 14}}>Scan</Text>
            </Button>
        </Content>
      </Container>
    );
  }
}