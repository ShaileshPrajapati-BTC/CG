import React,{Component} from 'react';
import { 
  Container, 
  Content,
  Text,
  Button,Icon,Badge,
  Header,Left,Body,Title,Right,Subtitle,Card, CardItem,
  Thumbnail,Spinner
} from 'native-base';

import {Image,
  AsyncStorage,
  StyleSheet,
  Alert, 
  Platform, 
  DeviceEventEmitter,
  NativeAppEventEmitter,View,
  StatusBar} from 'react-native';

// import PushNotification from'react-native-push-notification';
import geolib from 'geolib';
import BackgroundTimer from 'react-native-background-timer';
import DropdownAlert from 'react-native-dropdownalert';

const EventEmitter = Platform.select({
  ios: () => NativeAppEventEmitter,
  android: () => DeviceEventEmitter,
})();

export default class Scan extends Component {

  constructor(props) {
    super(props);
    this.state ={
      distance: '',
      latitude: '',
      longitude: '',
      clock: 'Clock in',
      in_out_status: 'In',
      supervisor_name: ''
    };
  }
  
  _setStatus(){
    AsyncStorage.getItem('scan_status', (err, result) => {
      if (result!=null){
        scan_status = JSON.parse(result);
        // console.log(scan_status);
        this.setState({scan_status: scan_status});
      }
    });
    AsyncStorage.getItem('clock_status', (err, result) => {
      if (result!=null){
        clock = JSON.parse(result); 
        // console.log(clock);
        this.setState({clock: clock});
      }
    });
    AsyncStorage.getItem('location', (err, result) => {
      if (result!=null){
        location = JSON.parse(result);
        console.log(location);
        this.setState({longitude: location.longitude, latitude: location.latitude});
        // this._startLocationTracking();
      }
      else{
        BackgroundTimer.stop();
      }
    });
    AsyncStorage.getItem('in_out_status', (err, result) => {
      if (result!=null){
        in_out_status= JSON.parse(result)
        this.setState({in_out_status: in_out_status});
      }
    });

  }

  componentWillMount(){
    AsyncStorage.getItem('name', (err, result) => {     
      if (result!=null){
        name = JSON.parse(result) 
        this.setState({name: name});
      }
    });
    AsyncStorage.getItem('supervisor_name', (err, result) => {     
      if (result!=null){
        supervisor_name = JSON.parse(result) 
        this.setState({supervisor_name: supervisor_name});
      }
    });
    this._setStatus();    
  }

  _startLocationTracking(){
    console.log('..............Tracking');
    BackgroundTimer.start(500000);
    EventEmitter.addListener('backgroundTimer', () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          var dis = geolib.getDistance(
                      {latitude: this.state.latitude, longitude: this.state.longitude},
                      {latitude: position.coords.latitude, longitude: position.coords.longitude}
                    );
          var distance_in_meter = geolib.convertUnit('m',dis , 2);
          this.setState({distance: distance_in_meter});
          if (distance_in_meter > 10){
            // Alert.alert("Tracking", "your are "+ distance_in_meter +" meter away from location");
          }
        },
         (error) =>  {
          console.log(error);
          // Alert.alert("Tracking", "Unable to track your location please enable location!");
         } 
        ,
        {enableHighAccuracy: false, timeout: 5000}
      );
    });
  }

  componentDidMount() {
    console.log("zczc->>>>>>>>>>>>>");
    if (this.props.msg!=null){
      this.dropdown.alertWithType(this.props.msg.status, this.props.msg.status, this.props.msg.message);
    }
  }

  componentDidUnount() {
    BackgroundTimer.stop();
  }

  _checkTaskStatus(){
    if (this.state.in_out_status == "Out"){
      this._navigate('Task');
    }
    else{
      this._navigate('Qrcode');
    }

  }
  _navigate(name, type) {
    this.props.navigator.push({
      name: name,
      passProps: {
        type: type
      }
    })
  }
  
  _logout(){
    BackgroundTimer.stop();
    AsyncStorage.multiRemove(['token','scan_status', 'clock_status', 'appointment_id', 'client_id', 'location','in_out_status'], (err, result) => {
      this._navigate('Splash','');
    });
  }
  
  render() {
    return (
    //<Image style={styles.container} ref={'backgroundImage'} source={require('./images/back.jpg')}>
    //<Subtitle style={{fontSize:10,color: 'white', right: (Platform.OS === 'ios') ? 1 : 0}}></Subtitle>
      <Container>
        <Header style={{ backgroundColor:'#de6262',height: (Platform.OS === 'ios') ? 64 : 54}}>
          <Left>
            <Thumbnail small source={require('./images/user1.jpg')}/>
          </Left>
          <Body style={{right: (Platform.OS === 'ios') ? 50 : 0}}>
            <Title style={{color: 'white'}}>{this.state.name}</Title>
          </Body>
          <Right>
            <Button transparent onPress={ () => this._logout()}>
              <Title transparent style={{color: 'white'}}>
                Logout
              </Title>             
            </Button>
          </Right>   
          <DropdownAlert ref={(ref) => this.dropdown = ref} updateStatusBar={false}/>       
        </Header>
        <Content>
          <StatusBar backgroundColor="#de6262"/>
          <Card style={{marginTop: 20}}>
            <CardItem header>
              <Text style={{color: '#de6262', fontSize: 20, fontWeight: "bold"}}>Appointment Information</Text>
            </CardItem>
            <CardItem style={{borderWidth: 0}}>
              <Icon active name="ios-person" />
              <Text>Supervisor</Text>
              <Right>
                <Text>{this.state.supervisor_name}</Text>
              </Right>
            </CardItem>
            <CardItem>
              <Icon active name="ios-timer" />
              <Text>Status</Text>
              <Right>
                <Text>{this.state.scan_status}</Text>
              </Right>
            </CardItem>
          </Card>
          <Button  onPress={()=> this._checkTaskStatus()} style={{justifyContent:'center', backgroundColor:'#de6262', marginTop:50, marginBottom:30, alignSelf: 'center',width:120,height:120, borderRadius:60}}>
            <Text style={{ alignSelf: 'center'}}>{this.state.clock}</Text>
          </Button>
        </Content>
        <Image small  style={{alignSelf: 'center',marginBottom: 10}} source={require('./images/bottom_logoo.png')}/>
      </Container>
    //</Image>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    resizeMode: 'cover',
    width: null,
    height: null,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: '#FFFFFF',
  },
  blurView: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  }
});