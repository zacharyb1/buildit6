import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLView } from 'expo-gl';
import RNFS from 'react-native-fs';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

export default function App() {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [model, setModel] = useState<handPoseDetection.HandDetector | null>(null);
  const [gesture, setGesture] = useState('');

  useEffect(() => {
    async function loadModel() {
      await tf.ready();
      const model = await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands);
      setModel(model);
    }
    loadModel();
  }, []);

 

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleCameraStream = async (camera: Camera) => {
    if (!model || !camera) return;
    
    // Simplified; adjust according to your actual camera setup
    const cameraTexture = camera.getTexture();
    const predictions = await model.estimateHands(cameraTexture);
    if (predictions.length > 0) {
      // Add logic to determine if the thumb is up
      setGesture('Thumb Up'); // Placeholder, adjust as necessary
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          {gesture !== '' && <Text style={styles.gestureText}>{gesture}</Text>}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  gestureText: {
    fontSize: 20,
    color: 'red',
    position: 'absolute',
    top: 20,
    alignSelf: 'center'
  },
});