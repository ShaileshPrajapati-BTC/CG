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
    AsyncStorage.removeItem('token', (err, result) => {
      this._navigate('Login','');
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
        <Header>
          <Left>
            {this.props.emergency_icon ?
                <Button transparent onPress={ () => this.props.navigator.pop()} style={{height: 60}}>
                  <Icon name="arrow-back"/>
                    <Thumbnail style={{marginLeft: 5}} source={{uri: "https://media.licdn.com/mpr/mpr/shrinknp_100_100/AAEAAQAAAAAAAAvOAAAAJGQzYjZkMjIzLTE2YzktNDA1YS1iNWU1LTdmNDRmNmQzNTMwOQ.jpg"}} />                    
                </Button>
              : <Thumbnail source={{uri: "https://media.licdn.com/mpr/mpr/shrinknp_100_100/AAEAAQAAAAAAAAvOAAAAJGQzYjZkMjIzLTE2YzktNDA1YS1iNWU1LTdmNDRmNmQzNTMwOQ.jpg"}} />}
          </Left>
          <Body style={{marginLeft: this.props.emergency_icon ? 30 : 0}}>
            <Title >{this.state.name}</Title>
            <Subtitle style={{color: 'white',marginLeft: 5}}>{this.state.scan_status}</Subtitle>
          </Body>
          <Right>
            {!this.props.emergency_icon ?
                <Text transparent onPress={ () => this._logout()} style={{color: 'white'}}>
                  Logout
                </Text>
                : null}
          </Right>  
          
        </Header>
    );
  }
}