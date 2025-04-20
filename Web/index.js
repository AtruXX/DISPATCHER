import { AppRegistry } from 'react-native';
import App from './App';

// Register the app
AppRegistry.registerComponent('Atrux', () => App);

// Web-specific code
if (window.document) {
  AppRegistry.runApplication('Atrux', {
    rootTag: document.getElementById('root')
  });
}