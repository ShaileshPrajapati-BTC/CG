import React,{Component} from 'react';
import { 
  Container, 
  Content,
  Text,
  Button,
  Spinner,
  Card, 
  CardItem,
  Icon,
  Right,
  Body,
  Picker,
  Form,
  Label,Input,Item
} from 'native-base';

const Picker_Item = Picker.Item;
var picker_state = {};

import {Image,
  StatusBar,
  Dimensions,
  AsyncStorage,
  Alert,
  ToastAndroid
} from 'react-native';       

import CONFIG from './config/config.js';
import Header from './components/back_header.js';   

export default class Task extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      picker_state: {},
      token: '',
      appointment_id: '',
      disabled: false,
      loading: true,
      extra_milage: '',
      injury_status: ''
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
  
  _navigate(name, data) {
    this.props.navigator.push({
      name: name,
      passProps: {
        picker_state: data.picker_state,
        extra_milage: data.extra_milage,
        injury_status: data.injury_status
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
        this.setState({loading: false});
      })
     .done(() => {

     });
  }

  _confirmation_for_submit(){
    Alert.alert(
      'Confirmation!',
      'Are you sure you want to submit?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this._sendTodoList()},
      ],
      { cancelable: false }
    )
  }

  async _sendTodoList(){
    this.setState({disabled: true, loading: true});
    this._navigate('Qrcode', {
      picker_state: this.state.picker_state,
      extra_milage: this.state.extra_milage,
      injury_status: this.state.injury_status
    });
  }  

  _alertPopup(title, msg){
    Alert.alert(
      title,
      msg,
      [
        {text: 'OK'},
      ],
      { cancelable: false }
    )
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
                      iosHeader="Care Plan"
                      mode="dropdown" style={{height:35, width:130}}
                      headerBackButtonText="Go Back"
                      onValueChange={this.onValueChange.bind(this, val)}
                      selectedValue={this.state.picker_state['todo_id-'+val]}
                    >
                      <Picker_Item label="Yes" value = "status-yes" />
                      <Picker_Item label="No" value= "status-no" />
                      <Picker_Item label="Refused" value= "status-refused" />
                   </Picker>
                  </Right>
                </CardItem>
              )
            }
          }
          task.push(
            <Card style={{borderBottomWidth:5}} bordered={true}>
              <CardItem header >
                <Text style={{color: '#de6262', fontSize: 20, fontWeight: "bold"}}>{key}</Text>
              </CardItem>
              {sub}
            </Card>
          )
          sub = []
        }
      }
      task.push(
      <Card>
        <CardItem header >
          <Text style={{color: '#de6262', fontSize: 20, fontWeight: "bold"}}>Extra Activity</Text>
        </CardItem>
        <CardItem>
          <Form>
            <Item stackedLabel style={{marginRight: 25}}>
              <Label >Do you have any reimbursable Milage to enter?</Label>
              <Input multiline={true}  onChangeText={(text) => {this.setState({extra_milage: text})}}/>
            </Item>
            <Item stackedLabel style={{marginRight: 25}}>
              <Label> Any injuries to Client or to yourself?</Label>
              <Input multiline = {true}  onChangeText={(text) => {this.setState({injury_status: text})}}/>
            </Item>
          </Form>
        </CardItem>
      </Card>
    )
    return (
      <Container>
        <Header navigator={this.props.navigator} emergency_icon={true} ref={(header) => { this.header = header; }}/>
        <StatusBar backgroundColor="#de6262" />
        {(this.state.loading)? <Content contentContainerStyle={{flex: 1, justifyContent: 'center',alignItems: 'center'}}><Spinner color='#de6262'/><Text style={{color: '#de6262'}}>Please wait...</Text></Content> : 
          <Content >
            {task}
          </Content>
        }
        {(!this.state.loading)? 
          <Button style={{justifyContent:'center', backgroundColor:'#de6262', alignSelf: 'center', marginTop: 30, marginBottom: 20,width:150, borderRadius:10}} onPress={ () => this._confirmation_for_submit() }>
            {(this.state.disabled)? <Spinner color='#ffffff'/> : <Text>Submit</Text>}
          </Button>: <Text/>}
      </Container>
    );
  }
}