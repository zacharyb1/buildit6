import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLView } from 'expo-gl';
import RNFS from 'react-native-fs';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { cameraWithTensors, CameraProps, TensorCamera } from '@tensorflow/tfjs-react-native';
import { RNCamera as Camera } from 'react-native-camera';

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

  const handleCameraStream = (images: IterableIterator<tf.Tensor3D>) => {
    const loop = async () => {
      const nextImageTensor = images.next().value;
      if (!model || !nextImageTensor) {
        requestAnimationFrame(loop);
        return;
      }

      const predictions = await model.estimateHands(nextImageTensor);
      if (predictions.length > 0) {
        setGesture('Thumb Up'); // Simplified check
      } else {
        setGesture('');
      }

      tf.dispose(nextImageTensor);
      requestAnimationFrame(loop);
    };

    loop();
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
  const TensorCamera = cameraWithTensors(Camera);

  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        type={facing}
        cameraTextureHeight={1920}
        cameraTextureWidth={1080}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
        useCustomShadersToResize={true}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          {gesture !== '' && <Text style={styles.gestureText}>{gesture}</Text>}
        </View>
      </TensorCamera>
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