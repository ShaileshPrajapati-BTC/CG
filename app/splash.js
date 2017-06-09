import React,{Component} from 'react';
import { 
  Container, 
  Content,
  Text,
  Button,Spinner
} from 'native-base';

import {Image, StatusBar, Dimensions, AsyncStorage} from 'react-native';       
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
          <Content >
            <StatusBar backgroundColor="#4527a0" barStyle="light-content"/>
            <Image square  style={{alignSelf: 'center', marginTop: Dimensions.get("window").height/2-120 }} source={require('./images/Logo.png')}  />
            <Spinner color='#2196F3'/>            
        </Content>
      </Container>
    );
  }
}