import React,{Component} from 'react';
import { 
  Container, 
  Content,
  Text,
  Button,Icon,Badge,
  Header,Left,Body,Title,Right,Subtitle,
  Thumbnail
} from 'native-base';

import {Image, AsyncStorage, Alert, Platform, DeviceEventEmitter,NativeAppEventEmitter,ToastAndroid} from 'react-native';       
import PushNotification from'react-native-push-notification';
import geolib from 'geolib';
import BackgroundTimer from 'react-native-background-timer';

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
      in_out_status: 'In'
    };
  }
  
  _setStatus(){
    AsyncStorage.getItem('name', (err, result) => {
      name = JSON.parse(result)      
      if (name!=null){
        this.setState({name: name});
      }
    });
    AsyncStorage.getItem('scan_status', (err, result) => {
      scan_status = JSON.parse(result)      
      if (scan_status!=null){
        // console.log(scan_status);
        this.setState({scan_status: scan_status});
      }
    });
    AsyncStorage.getItem('clock_status', (err, result) => {
      clock = JSON.parse(result);
      if (clock!=null){
        // console.log(clock);
        this.setState({clock: clock});
      }
    });
    AsyncStorage.getItem('location', (err, result) => {
      location = JSON.parse(result);      
      if (location!=null){
        console.log(location);
        this.setState({longitude: location.longitude, latitude: location.latitude});
        // this._startLocationTracking();
      }
      else{
        BackgroundTimer.stop();
      }
    });
    AsyncStorage.getItem('in_out_status', (err, result) => {
      in_out_status= JSON.parse(result)
      if (result!=null){
        this.setState({in_out_status: in_out_status});
      }
    });

  }

  componentWillMount(){
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
    console.log(this.props.navigator.getCurrentRoutes())
  }

  componentDidUnount() {
    BackgroundTimer.stop();
  }

  _checkTaskStatus(){
    if (this.state.in_out_status == "Out"){
      this._navigate('Task',this);
    }
    else{
      this._navigate('Qrcode', this);
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
      <Container>
        <Header>
          <Left>
            <Thumbnail source={require('./images/user1.jpg')} />
          </Left>
          <Body style={{left: this.props.emergency_icon ? 30 : 0}}>
            <Title >{this.state.name}</Title>
            <Subtitle style={{color: 'white',marginLeft: 5}}>{this.state.scan_status}</Subtitle>
          </Body>
          <Right>
            <Button transparent onPress={ () => this._logout()}>
              <Text transparent style={{color: 'white'}}>
                Logout
              </Text>             
            </Button>

          </Right>          
        </Header>

        <Content padder>
          <Image square  style={{ alignSelf: 'center',height:200,width:200, marginTop: 60 }} source={require('./images/qrcode.jpg')}  />
          <Button  onPress={()=> this._checkTaskStatus()} style={{ backgroundColor:'#4527a0', alignSelf: 'center', marginTop: 30, marginBottom: 20 }}>
            <Text style={{ alignSelf: 'center'}}>{this.state.clock}</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}