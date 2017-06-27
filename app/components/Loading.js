import React,{Component} from 'react';
import {
  Content, 
  Spinner,
  Text
} from 'native-base';

export default class Loading extends Component {
  render() {
    return (
        <Content contentContainerStyle={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
          <Spinner color='#de6262'/>
          <Text style={{color: '#de6262'}}>Please wait...</Text>
        </Content>
    );
  }
}