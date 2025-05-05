import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import LoginScreen from './Screens/Login/index.js';
import MainScreen from './Screens/Main/index.js';
import TransportsScreen from './Screens/Transports/index.js';
import Drivers from './Drivers.js';
import Trucks from './Trucks.js';
import AssignTransports from './Assign_transport.js';
import CreateTransport from './Screens/CreateTransport/index.js';
import cmr from './CMR.js';
import { enableScreens } from 'react-native-screens';

enableScreens();

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>Something went wrong!</Text>
          <Text>{this.state.error?.toString()}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const Stack = createNativeStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [initialRoute, setInitialRoute] = useState('Login');

  // Check if user is logged in on app start
  useEffect(() => {
    
    const bootstrapAsync = () => {
      try {
        // Get the token from localStorage
         
        const token = localStorage.getItem('authToken'); // FIXED: Changed from setting to getting
        
        // Get the last visited route if available
        const lastRoute = localStorage.getItem('lastRoute');
        
        if (token) {
          setUserToken(token);
          setInitialRoute('Main');
        }
      } catch (e) {
        console.error('Failed to get token or route from storage', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Create a navigation state listener
  const handleStateChange = (state) => {
    if (state && state.routes.length > 0) {
      // Get the current route
      const currentRouteName = state.routes[state.index].name;
      
      // Save the current route to localStorage
      if (currentRouteName !== 'Login') {
        localStorage.setItem('lastRoute', currentRouteName);
      }
    }
    console.log('Nav state:', state);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer
          onStateChange={handleStateChange}
          fallback={<Text>Se incarca...</Text>}
        >
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Transports"
              component={TransportsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Drivers"
              component={Drivers}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Trucks"
              component={Trucks}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AssignTransports"
              component={AssignTransports}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateTransport"
              component={CreateTransport}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CMR"
              component={cmr}
              options={{ headerShown: false }}
              />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;