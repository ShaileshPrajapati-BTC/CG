import React,{Component} from 'react';

import Login from '../login.js';
import Qrcode from '../qrcode.js';
import Scan from '../scan.js';
import Splash from '../splash.js';
import Task from '../task.js';

exports.renderScene = function(route, navigator) {
  if(route.name == 'Login') {
    return <Login navigator={navigator} {...route.passProps}  />
  }
  if(route.name == 'Qrcode') {
    return <Qrcode navigator={navigator} {...route.passProps}  />
  }
  if(route.name == 'Scan') {
    return <Scan navigator={navigator} {...route.passProps}  />
  }
  if(route.name == 'Splash') {
    return <Splash navigator={navigator} {...route.passProps}  />
  }
  if(route.name == 'Task') {
    return <Task navigator={navigator} {...route.passProps}  />
  }
};
