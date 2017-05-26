import React,{Component} from 'react';
import { 
  Container,
  Content,
  Input,
  Text,
  Button,
  Form,
  Item,
  Label,
  Thumbnail
} from 'native-base';

import {AsyncStorage, StatusBar, ToastAndroid} from 'react-native';
import Header from './components/header.js';

export default class Emergency extends Component {

  constructor(props) {
    super(props);
  }

  _sendData() {
    ToastAndroid.show('Your Request is Submited.',ToastAndroid.SHORT,ToastAndroid.CENTER,);
    this._navigate('Scan');
  }

  _navigate(name) {
    this.props.navigator.push({
      name: name
    })
  }
  
  render() {
    return (
      <Container >
        <Content>
          <StatusBar backgroundColor="#4527a0" barStyle="light-content"/>
          <Header navigator={this.props.navigator} emergency_icon={true}/>
          <Form style={{ marginTop: 70}}>
            <Item stackedLabel>
              <Label>Do you have any reimbursable millage to enter?</Label>
              <Input autoFocus = {true}/>
            </Item>
            <Item stackedLabel>
              <Label> Any injuries to Client or to yourself?</Label>
              <Input />
            </Item>
              <Button style={{ backgroundColor:'#4527a0', alignSelf: 'center', marginTop: 20, marginBottom: 20,width:100 }} onPress={ () => this._sendData() }>
                <Text style={{ marginLeft: 8}}>Submit</Text>
              </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}