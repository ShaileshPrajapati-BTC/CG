import React,{Component} from 'react';
import { 
  Container, 
  Content,
  Text,
  Button,Spinner
} from 'native-base';

import {Image, StatusBar, Dimensions, AsyncStorage, StyleSheet} from 'react-native';       
import Header from './components/header.js';

export default class Splash extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    setTimeout( () => {
      this.checkLogin();
    },1000);
  }
  
  async checkLogin(){
    AsyncStorage.getItem('token', (err, result) => {
      current_user= JSON.parse(result)
      if (result!=null){
        this._navigate('Scan','In');
      }
      else
      {
        this._navigate('Login','');
      }
    });
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
            <Content contentContainerStyle={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
              <StatusBar backgroundColor="#de6262"/>
              <Image square  style={{alignSelf: 'center', width:300, height:60 }} source={require('./images/Logoo.png')}  />
              <Spinner color='#de6262'/>            
          </Content>
        </Container>
    );
  }
}
