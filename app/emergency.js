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
  Thumbnail,
  Icon,
  Spinner
} from 'native-base';

import {AsyncStorage, StatusBar, ToastAndroid, Alert} from 'react-native';
import Header from './components/back_header.js';
import CONFIG from './config/config.js';

export default class Emergency extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      disabled: false,
      appointment_id: null,
      client_id: null,
      extra_milage: '',
      injury_status: ''
    };
  }
  
  componentWillMount(){
    this._setData();
  }

  _setData(){
    AsyncStorage.getItem('client_id', (err, result) => {
      client_id = JSON.parse(result); 
      if (client_id!=null){
        this.setState({client_id: client_id});
        console.log(client_id);
      }
    });
    AsyncStorage.getItem('appointment_id', (err, result) => {
      appointment_id = JSON.parse(result)      
      if (appointment_id!=null){
        this.setState({appointment_id: appointment_id});
        console.log(appointment_id);
      }
    });
  }
  
  async _sendData() {
    this.setState({disabled: true});

    if (this.state.client_id !=null && this.state.appointment_id != null){
      let response = await fetch(CONFIG.BASE_URL+'emergency/new', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
          appointment_id: this.state.appointment_id,
          client_id: this.state.client_id,
          extra_milage: this.state.extra_milage,
          injury_status: this.state.injury_status
        })
      }).catch(function(error) {
        Alert.alert("Error", "Something went wrong please try again later!!");
        this.setState({disabled: false});
      });

      try {
        let res = await response.json();
        console.log(res);
        if (res.status)
        {

          ToastAndroid.show(res.message,ToastAndroid.SHORT,ToastAndroid.CENTER,);
          this._navigate('Scan','In');
        }
        else{
          this.setState({disabled: false});
          ToastAndroid.show(res.message,ToastAndroid.SHORT,ToastAndroid.CENTER,);
        }
      }catch(error) {
        Alert.alert("Error", "Something went wrong please try again later!!");
        console.log(error);
      }
    }
    else{
      Alert.alert("Error", "Please first Clock in!!");
      this.setState({disabled: false});
    }
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
              <Label>Do you have any reimbursable Milage to enter?</Label>
              <Input autoFocus = {true} onChangeText={(text) => {this.setState({extra_milage: text})}} multiline = {true} numberOfLines = {4}/>
            </Item>
            <Item stackedLabel>
              <Label> Any injuries to Client or to yourself?</Label>
              <Input onChangeText={(text) => {this.setState({injury_status: text})}}/>
            </Item>
              <Button style={{ backgroundColor:'#4527a0', alignSelf: 'center', marginTop: 20, marginBottom: 20,width: 100 }} onPress={ () => this._sendData() }>
                {(this.state.disabled)? <Spinner color='#ffffff' style={{marginLeft: 15}}/> : <Text style={{ marginLeft: 10}}>Submit</Text>}
              </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}