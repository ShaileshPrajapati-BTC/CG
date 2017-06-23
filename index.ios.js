/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import Route from './app/config/Routes.js';
import {
  AppRegistry,
  View,Text
 } from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';
// import RequiresConnection from 'react-native-offline-mode';

var navigator;

export default class Caregiver extends Component {

  render() {
     return (
        <NavigationExperimental.Navigator
          style={{ flex:1 }}
          ref={(nav) => { navigator = nav; }}
          initialRoute={{ name: 'Splash' }}
          renderScene={ Route.renderScene }
          onDidFocus={(route) => {
            if (route.reset) {
              this.refs.navigator.immediatelyResetRouteStack([{ name: route.name }])
            }
          }}
          configureScene={(route, routeStack) => NavigationExperimental.Navigator.SceneConfigs.FadeAndroid}
        />
      );
  }
}

class OfflineClass extends Component {
  render() {
    return (
      <Text>Oh snap! You're offline!</Text>
    )
  }
}
const offlineFunction = () => 
    <View style={{flex:1,flexDirection:'column',justifyContent:'center', alignItems:'center',padding:30}}>
      <Text style={{fontSize:17,fontWeight:'bold'}}>
        No Internet Available.Please check your Internet connection.
      </Text>
    </View>

AppRegistry.registerComponent('Caregiver', () => Caregiver);
