import { SplashScreen, Slot } from "expo-router";
import {
  useFonts,
  PermanentMarker_400Regular,
} from "@expo-google-fonts/permanent-marker";
import { useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import "expo-dev-client";

SplashScreen.preventAutoHideAsync(); //

// Function to request a JWT from the server
async function requestToken() {
  const response = await fetch(
    "https://pic-poet-server-dc020df3cea7.herokuapp.com/api/token"
  );
  const data = await response.json();
  return data.token;
}

// Function to retrieve the API key using the JWT
async function retrieveApiKey() {
  const token = await requestToken();

  const response = await fetch(
    "https://pic-poet-server-dc020df3cea7.herokuapp.com/api/get-api-key",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch API key due to authentication error.");
  }

  const data = await response.json();

  await SecureStore.setItemAsync("api_key", data.apiKey);
}

export default function Layout() {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [fontsLoaded, fontError] = useFonts({
    PermanentMarker_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    retrieveApiKey();
  }, []);

  useEffect(() => {
    if (status === "denied") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Please enable media library access in your settings",
      });

      requestPermission();
    }
  }, [status]);

  if (status === null) {
    requestPermission();
  }

  // Prevent  rendering until the font has loaded or an errorr was returned
  if (!fontsLoaded || fontError) {
    return null;
  }

  //Render the children routes now that all the assests are loaded
  return (
    <>
      <Slot />
      <Toast />
    </>
  );
}
