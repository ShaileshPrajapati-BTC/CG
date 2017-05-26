import React,{Component} from 'react';
import { 
  Container, 
  Content,
  Text,
  Button
} from 'native-base';

import {Image, StatusBar} from 'react-native';       
import Header from './components/header.js';

export default class Splash extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount(){
    setTimeout( () => {
      this._navigate('Login','');
    },1000);
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
          <Content >
            <StatusBar backgroundColor="#4527a0" barStyle="light-content"/>
            <Image square  style={{height:150, width:150,alignSelf: 'center',marginTop: 220 }} source={require('./images/car-icon.png')}  />
        </Content>
      </Container>
    );
  }
}