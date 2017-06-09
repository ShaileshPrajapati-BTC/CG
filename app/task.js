import React,{Component} from 'react';
import { 
  Container, 
  Content,
  Text,
  Button,Spinner,Card, CardItem, Icon, Right, Body, Picker
} from 'native-base';

const Item = Picker.Item;
var picker_state = {};

import {Image, StatusBar, Dimensions, AsyncStorage, Alert, ToastAndroid} from 'react-native';       
import Header from './components/header.js';
import CONFIG from './config/config.js';

export default class Task extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      picker_state: {},
      loading: false,
      token: '',
      appointment_id: ''
    };
  }

  componentWillMount() {
    this.state['picker_state']=picker_state
    this._getToken();
    setTimeout( () => {
      this._getTodoList();
    },1000);
  }

  componentDidMount(){
    this.state['picker_state']=picker_state
  }
  
  _navigate(name, type) {
    this.props.navigator.push({
      name: name,
      passProps: {
        type: type
      }
    })
  }

  onValueChange (value: string, val) {
    picker_state['todo_id-'+value]= val
    this.setState({picker_state: picker_state})
    console.log(picker_state);
  }

  async _getToken(){
    AsyncStorage.getItem('token', (err, result) => {
       token= JSON.parse(result)
       if (result!=null){
          this.setState({token: token});
       }
     });
    AsyncStorage.getItem('appointment_id', (err, result) => {
      appointment_id = JSON.parse(result)      
      if (appointment_id!=null){
        this.setState({appointment_id: appointment_id});
      }
    });
  }

  async _getTodoList(){
    this.setState({
      loading: true
    });
    alert(this.state.appointment_id);
    fetch(CONFIG.BASE_URL+'todolist/new?appointment_id='+this.state.appointment_id, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'access_token': this.state.token
      }
      }).then((response) => response.json())
      .then((responseData) =>
      {
        console.log("----------------------->")
        console.log(responseData.data);
        this.setState({data: responseData.data});
      })
     .done(() => {

     });
  }

  async _sendTodoList(){

    let response = await fetch(CONFIG.BASE_URL+'todolist/update', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'access_token': this.state.token
      },
      body: JSON.stringify(
      {
        appointment_id: this.state.appointment_id,
        todo_list: this.state.picker_state,
      })
    }).catch(function(error) {
      Alert.alert("Error", "Something went wrong please try again later!!");
      $this.setState({disabled: false});
    });
    try {
      let res = await response.json();
      console.log(res);
      if (res.status)
      {
        ToastAndroid.show(res.message,ToastAndroid.SHORT,ToastAndroid.CENTER);
      }
      else{
        ToastAndroid.show(res.message,ToastAndroid.SHORT,ToastAndroid.CENTER);
      }
    } catch(error) {
      Alert.alert("Error", "Something went wrong please try again later!!");
      console.log(error);
    }
  }  

  render() {
    const data = this.state.data;
    var task = []
    var sub = []
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          console.log(key + " -> " + data[key]);
          
          for(var val in data[key]){
            if (data[key].hasOwnProperty(val)) {
              console.log(val+ " ->"+ data[key][val]);
              picker_state['todo_id-'+val] = picker_state['todo_id-'+val] || "status-no";
              sub.push(
                <CardItem >
                  <Text>{data[key][val]}</Text>
                  <Right>
                    <Picker
                      supportedOrientations={['portrait','landscape']}
                      iosHeader="Select one"
                      mode="dropdown" style={{height:35, width:100}}
                      onValueChange={this.onValueChange.bind(this, val)}
                      selectedValue={this.state.picker_state['todo_id-'+val]}
                    >
                      <Item label="Yes" value = "status-yes" />
                      <Item label="No" value= "status-no" />
                      <Item label="Refused" value= "status-refused" />
                   </Picker>
                  </Right>
                </CardItem>
              )
            }
          }
          task.push(
            <Card>
              <CardItem header>
                <Text style={{color: '#512DA8', fontSize: 20, fontWeight: "bold"}}>{key}</Text>
              </CardItem>
              {sub}
            </Card>
          )
          sub = []
        }
      }
    return (
      <Container>
        <Content >
          <StatusBar backgroundColor="#4527a0" barStyle="light-content"/>
          {task}
        </Content>
          <Button  style={{backgroundColor: '#4527a0', alignSelf: 'center', marginTop: 25, marginBottom: 20,width:100 }} onPress={ () => this._sendTodoList() }>
             <Text style={{ marginLeft: 12}}>Submit</Text>
          </Button>
      </Container>
    );
  }
}