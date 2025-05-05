import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator,TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const BASE_URL = "https://atrux-717ecf8763ea.herokuapp.com/api/v0.1/";
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      const loginData = { email, password };
      const response = await fetch(
        `${BASE_URL}auth/token/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        // Store the auth token
        if (data.auth_token) {
          localStorage.setItem('authToken', data.auth_token);
          console.log('Token stored successfully');
          try{
            navigation.navigate('Main');
          }catch(navError){
            console.error('Navigation failed:', navError);
            window.location.href = '/main';
          }
        } else {
          setError('Invalid');
        }
      } else {
        setError('Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#f0f2f5', '#e6eaef']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Bine ai venit!</Text>
        <Text style={styles.subtitle}>Logheaza-te pentru a continua!</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#a0a0a0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Parola</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#a0a0a0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => alert('Password reset functionality')}
        >
          <Text style={styles.forgotPasswordText}>Ai uitat parola?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#4a6bf5', '#4361ee']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'LOGARE...' : 'LOGHEAZA-TE'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Nu ai cont? </Text>
          <TouchableOpacity onPress={() => alert('Register functionality')}>
            <Text style={styles.registerLink}>Inregistrare</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}


export default LoginScreen;