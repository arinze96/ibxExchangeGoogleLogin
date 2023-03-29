import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import "expo-dev-client";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import Header from "./Header";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId:
      "922553817342-hehk6ml53p3nuntg5mugdammdgpv199m.apps.googleusercontent.com",
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onGoogleButtonPress = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const user_sign_in = auth().signInWithCredential(googleCredential);

    user_sign_in
      .then((user) => {
        console.log(user, "user....");
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
    } catch (error) {
      console.log(error);
    }
  };

  if (initializing) return null;
  if (!user) {
    return (
      <View style={styles.container}>
        <Header />
        <GoogleSigninButton
          style={{ width: 300, height: 65, marginTop: 300 }}
          onPress={onGoogleButtonPress}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Header />
        <View style={{ marginTop: 100, alignItems: "center" }}>
          <Text style={styles.text}>Welcome, {user?.displayName}</Text>
          <Image
            source={{ uri: user.photoURL }}
            style={{ height: 300, width: 300, borderRadius: 150, margin: 50 }}
          />
          <Button title="Sign Out" onPress={signOut} />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 23,
    fontWeight: "bold",
  },
});
