import React,{Component} from 'react';
import {
  Icon, 
  Button,
  Header,
  Left,
  Body,
  Title,
  Right  
} from 'native-base';

import {Image, AsyncStorage} from 'react-native'; 
export default class Scan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }; 
  }

  componentWillMount(){
    AsyncStorage.getItem('name', (err, result) => {
      name = JSON.parse(result)      
      if (name!=null){
        this.setState({name: name});
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
              <Button transparent onPress={ () => this.props.navigator.pop()}>
                <Icon name="arrow-back" size={20} color='red' />
              </Button>
              : <Button transparent onPress={ () => this._logout()}>
                  <Icon name="log-out" size={20} color='red' />
                </Button>}
          </Left>
          <Body>
            <Title>{this.state.name}</Title>
          </Body>
            {!this.props.emergency_icon ?
                <Right>
                  <Button transparent onPress={ () => this._navigate('Emergency','')}>
                    <Icon name="call" size={20} color='red' />
                  </Button>
                </Right>
              : <Right></Right>}
            
        </Header>
    );
  }
}