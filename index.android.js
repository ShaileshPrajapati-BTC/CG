/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import Route from './app/config/Routes.js';
import {
  AppRegistry
 } from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';

var navigator;

export default class Caregiver extends Component {

  render() {
     return (
        <NavigationExperimental.Navigator
          style={{ flex:1 }}
          ref={(nav) => { navigator = nav; }}
          initialRoute={{ name: 'Splash' }}
          renderScene={ Route.renderScene }
          configureScene={(route, routeStack) => NavigationExperimental.Navigator.SceneConfigs.FadeAndroid}
        />
      );
  }
}


AppRegistry.registerComponent('Caregiver', () => Caregiver);
