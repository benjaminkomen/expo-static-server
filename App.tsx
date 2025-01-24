import {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import StaticServer from '@dr.pogodin/react-native-static-server';

export default function App() {
  const [pickedFileUri, setPickedFileUri] = useState<string | undefined>();
  const [serverInstance, setServerInstance] = useState<any | null>(null);

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (result !== null && result.assets && result.assets?.length > 0) {
      setPickedFileUri(result.assets[0].uri);
    }
  }

  function encodeFile(uri: string) {
    return uri.split('file://')[1];
  }

  async function startServer() {
    if (!pickedFileUri) {
      console.error('No file picked');
      return;
    }
    console.log(pickFile, encodeFile(pickedFileUri));
    console.log('Starting server...');
    const server = new StaticServer({
      fileDir: encodeFile(pickedFileUri),
      port: 8080,
      nonLocal: true,
    });
    server.start().then((url: string) => {
      console.log('Server started at', url);
    });
    setServerInstance(server);
  }

  async function stopServer() {
    if (!serverInstance) {
      console.error('No server instance to stop.');
      return;
    }

    serverInstance.stop().then(() => {
      console.log('Server stopped');
    });
    setServerInstance(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Static Server</Text>
      <Text style={styles.subtitle}>Picked File:</Text>
      <Text>{JSON.stringify(pickedFileUri, null, 2)}</Text>
      <View style={styles.buttons}>
        <Button title={'Pick a file'} onPress={pickFile}/>
        {!serverInstance ? (
          <Button title={'Start server'} onPress={startServer}/>
        ) : (
          <Button title={'Stop server'} onPress={stopServer}/>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
  },
  buttons: {
    gap: 10,
  },
});
