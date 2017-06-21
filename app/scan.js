import React,{Component} from 'react';
import { 
  Container, 
  Content,
  Text,
  Button,Icon,Badge,
  Header,Left,Body,Title,Right,Subtitle,
  Thumbnail,Spinner
} from 'native-base';

import {Image, AsyncStorage,StyleSheet, Alert, Platform, DeviceEventEmitter,NativeAppEventEmitter,ToastAndroid,StatusBar} from 'react-native';       
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
    <Image style={styles.container} ref={'backgroundImage'} source={{uri: 'http://pre12.deviantart.net/54fe/th/pre/i/2014/303/5/5/gradient_blur_abstract_hd_wallpaper_1920x1200_4426_by_satriohasmoro-d84o6ls.jpg'}}>
      <Container >
        <Header style={{ backgroundColor:'#de6262'}}>
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

        <Content contentContainerStyle={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
          <StatusBar
            backgroundColor="#de6262"
            barStyle="light-content"
          />
          <Button  onPress={()=> this._checkTaskStatus()} style={{justifyContent:'center', backgroundColor:'#de6262', alignSelf: 'center', marginTop: 30, marginBottom: 20,width:100,height:100, borderRadius:50}}>
            <Text style={{ alignSelf: 'center'}}>{this.state.clock}</Text>
          </Button>
        </Content>
      </Container>
    </Image>
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