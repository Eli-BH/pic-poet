import {
  StyleSheet,
  View,
  Pressable,
  ImageBackground,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import takePhoto from "./utils/camera/takePhoto";

export default function CameraPage() {
  const [flash, setFlash] = useState(FlashMode.off);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const camera = useRef(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      if (permission.canAskAgain) {
        requestPermission();
      } else {
        Alert.alert(
          "Permission Denied",
          "Please enable camera permissions in your app settings to use this feature."
        );
      }
    }
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/ikhlas-rahman-rIEA6hYEFYY-unsplash.jpg")}
        style={styles.image}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.flashView}>
            <Pressable
              onPress={() =>
                setFlash((curValue) =>
                  curValue === FlashMode.on ? FlashMode.off : FlashMode.on
                )
              }
            >
              <Ionicons
                name={flash === "off" ? "flash-off" : "flash-outline"}
                size={24}
                color="white"
              />
            </Pressable>
          </View>

          <Link href="/">
            <View style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </View>
          </Link>
        </View>

        <SafeAreaView style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={CameraType.back}
            autoFocus={true}
            flashMode={flash}
            ref={camera}
            ratio={"1:1"}
          />
        </SafeAreaView>

        <Pressable
          style={styles.shutterButton}
          onPress={() => takePhoto(camera)}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  camera: {
    height: 350,
    width: 350,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  cameraContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 50,
  },
  buttonContainer: {
    width: "100%",
    height: 100,
    alignItems: "center",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginTop: 30,
  },
  shutterButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 50,
    width: 75,
    height: 75,
    backgroundColor: "white",
    borderRadius: 75,
    borderWidth: 2,
    elevation: 5,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 5,
    padding: 10,
    borderWidth: 2,
  },
  flashView: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 5,
    padding: 10,
    borderWidth: 2,
  },
});
