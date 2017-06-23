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

import {Image, AsyncStorage, View, Platform} from 'react-native'; 
import DropdownAlert from 'react-native-dropdownalert';

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
  
  _navigate(name) {
    this.props.navigator.push({
      name: name
    })
  }
  _alert(msg){
    if (msg!=null){
      this.dropdown.alertWithType(msg.status, msg.status, msg.message);
    }  
  }

  _back_press(){
    routes = this.props.navigator.getCurrentRoutes();
    routeToGo = routes.find( route => route.name == 'Scan');
    this.props.navigator.popToRoute(routeToGo);
    //this._navigate('Scan',null);
  }
  render() {
    return (
        <Header style={{ backgroundColor:'#de6262', height: (Platform.OS === 'ios') ? 64 : 0}}>
          <Left>
            <Button transparent onPress={ () => this._back_press()} style={{height: 60}}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
                <Thumbnail small source={require('../images/user1.jpg')} style={{left: 5}}/>                    
            </Button>
          </Left>
          <Body style={{right: (Platform.OS === 'ios') ? 30 : 0}}>
            <Title style={{color: 'white'}}>{this.state.name}</Title>
          </Body>
          <Right/>
          <DropdownAlert ref={(ref) => this.dropdown = ref} updateStatusBar={false}/>
        </Header>
    );
  }
}