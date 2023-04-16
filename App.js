import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0)).current;
  const [imageUri, setImageUri] = useState('');
  const [triggered, setTriggered] = useState(false);
  const [startText, setStart] = useState("Press To Start!");

/*
  This is the Fade In Animation used on the View when the app loads
*/
  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnim]);

  // Handling the pressing of the Button on screen
  const handlePress = () => {
    // Creates Fade out animation for smooth transition whenever a new 
    // Picture URL is fetched from the API
    Animated.parallel([
      Animated.timing(imageOpacity, {toValue: 0, duration: 1000, useNativeDriver: true}),
      Animated.timing(imageScale, {toValue: 0.25, duration: 1000, useNativeDriver: true})
    ]).start();

    // Fetching the dog picture urls from the API
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(data => {

        // Set new image url and trigger the display of the image
        setImageUri(data.message);
        setTriggered(true);
        setStart("Load Another!")

        // Starting Image Transition Fade in effect.
        Animated.parallel([
          Animated.timing(imageOpacity, {toValue: 1, duration: 1000, useNativeDriver: true}),
          Animated.timing(imageScale, { toValue: 1, duration: 1000, useNativeDriver: true})
        ]).start();
        
      })

      // Catching error and displaying it to console
      .catch(error => console.log(error));
  };

  return (
    <Animated.View style={[styles.container, {opacity: fadeInAnim,}]}>
      <View style={{
        flex: 1,
        justifyContent: 'center'
      }}>
        <Text style={[styles.text,
          {
            fontSize: 30, 
            textAlign: 'center',
            marginTop: 50
            }
        ]}>Welcome to Doggo Randomizer!</Text>
      </View>
      <StatusBar style="auto" />

      {triggered && (
        <View style={{flex: 1}}>
            <Animated.Image style={[
              {
                width: 300,
                height: 300, 
                marginTop: 10, 
                borderRadius: 8, 
                borderWidth: 2, 
                borderColor: '#35281d',
              },
              {
                opacity: imageOpacity,
                transform: [{ scale: imageScale }]
              },
            ]}
              source={{ uri: imageUri}}
            />
        </View>
        )}
      <View style={{flex: 1}}>
      <Pressable
        onPress={handlePress}
        style={({pressed}) => [
          {
            backgroundColor: pressed ? '#b8336a' : '#00A6A6',
            elevation: 5,
            shadowColor: pressed ? '#00A6a6' : '#b8336a',
            shadowOffset: pressed ? {width: 0, height: 0} : { width: 3, height: 3},
            shadowOpacity: 1,
            shadowRadius: 3,
          },
          styles.startButton,
      ]}>
        <Text style={[styles.text, {fontSize: 20, fontWeight: 'bold'}]}>{startText}</Text>
      </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#726da8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },

  startButton: {
    marginTop: 50,
    borderRadius: 10,
    padding: 8,
  },

  text: {
    color: '#FFEECF',
    textShadowColor: '#35281d',
    textShadowOffset: {width: 2, heigh: 2},
    textShadowRadius: 3,
  }
});
