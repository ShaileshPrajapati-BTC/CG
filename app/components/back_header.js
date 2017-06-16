import React,{Component} from 'react';
import {
  Icon, 
  Button,
  Header,
  Left,
  Body,
  Title,
  Right,Text,Thumbnail,Subtitle
} from 'native-base';

import {Image, AsyncStorage, View} from 'react-native'; 
export default class Scan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      scan_status: ''
    }; 
  }

  componentWillMount(){
    AsyncStorage.getItem('name', (err, result) => {
      name = JSON.parse(result)      
      if (name!=null){
        this.setState({name: name});
      }
    });
    AsyncStorage.getItem('scan_status', (err, result) => {
      scan_status = JSON.parse(result)      
      if (scan_status!=null){
        this.setState({scan_status: scan_status});
      }
    });
  }

  _logout(){
    AsyncStorage.multiRemove(['token','scan_status', 'clock_status','in_out_status'], (err, result) => {
      this._navigate('Splash','');
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

  _back_press(){
    routes = this.props.navigator.getCurrentRoutes();
    routeToGo = routes.find( route => route.name == 'Scan');
    this.props.navigator.popToRoute(routeToGo);
  }
  render() {
    return (
        <Header>
          <Left>
            <Button transparent onPress={ () => this._back_press()} style={{height: 60}}>
              <Icon name="arrow-back"/>
                <Thumbnail style={{marginLeft: 5}} source={require('../images/user1.jpg')} />                    
            </Button>
          </Left>
          <Body style={{left: this.props.emergency_icon ? 30 : 0}}>
            <Title >{this.state.name}</Title>
            <Subtitle style={{color: 'white',marginLeft: 5}}>{this.state.scan_status}</Subtitle>
          </Body>
          <Right/>    
        </Header>
    );
  }
}