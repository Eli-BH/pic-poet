import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, Link } from "expo-router";
import { Image } from "expo-image";

import Toast from "react-native-toast-message";
import CardFlip from "react-native-card-flip";
import Share from "react-native-share";

import * as FileSystem from "expo-file-system";
import * as Clipboard from "expo-clipboard";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

const Page = () => {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);

  const loadItemsFromStorage = async () => {
    const filePath = FileSystem.documentDirectory + "savedItems.json";

    try {
      const jsonValue = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const dataObject = JSON.parse(jsonValue); // Parse the JSON string back to a JavaScript object
      return dataObject.data || []; // Access the 'data' key and return its value or an empty array if undefined
    } catch (e) {
      console.error("Failed to read JSON from storage:", e);
      return []; // Return an empty array in case of error
    }
  };

  useEffect(() => {
    loadItemsFromStorage().then((loadedItems) => {
      //return only the object with the matching id
      const item = loadedItems.find((item) => item.id === id);
      setItem(item);
      setLoading(false);
    });
  }, []);

  const shareImage = async (imageUri, message) => {
    try {
      const shareOptions = {
        title: "Share via Pic Poet",
        message: message + "\n\n" + "Shared via Pic Poet",
        url: imageUri,
      };

      Toast.show({
        style: "success",
        text1: "Poem Copied to your clipboard!",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });

      await Clipboard.setStringAsync(message + "\n\n" + "Shared via Pic Poet");
      await Share.open(shareOptions);
    } catch (error) {
      if (error.message === "User did not share") {
        console.log("User did not share");
      } else {
        console.error("Failed to share:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/ikhlas-rahman-rIEA6hYEFYY-unsplash.jpg")}
        style={{
          resizeMode: "cover",
          height: "100%",
          width: "100%",
        }}
      >
        {loading ? (
          <View
            style={{
              height: 190,
              elevation: 6,
              borderWidth: 2,
              borderRadius: 6,
              margin: 10,
            }}
          >
            <Text>Loading...</Text>
          </View>
        ) : (
          <>
            <View style={styles.cardContainer}>
              <CardFlip style={styles.card} ref={(card) => (this.card = card)}>
                <Pressable onPress={() => this.card.flip()}>
                  <Image
                    source={{ uri: item?.frontViewUri }}
                    style={{ width: 300, height: 370, borderWidth: 2 }}
                    contentFit="cover"
                  />
                </Pressable>
                <Pressable onPress={() => this.card.flip()}>
                  <Image
                    contentFit="cover"
                    source={{ uri: item?.backViewUri }}
                    style={{ width: 300, height: 370, borderWidth: 2 }}
                  />
                </Pressable>
              </CardFlip>
            </View>

            <View style={styles.buttonContainer}>
              <Link href="/">
                <View style={styles.buttonView}>
                  <FontAwesome5 name="home" size={24} color="black" />
                </View>
              </Link>

              <Pressable
                onPress={() => shareImage(item?.frontViewUri, item?.poem)}
              >
                <View style={styles.buttonView}>
                  <FontAwesome5 name="share-alt" size={24} color="black" />
                </View>
              </Pressable>

              <Link href="/CameraPage">
                <View style={styles.buttonView}>
                  <FontAwesome5 name="camera" size={24} color="black" />
                </View>
              </Link>
            </View>
          </>
        )}
      </ImageBackground>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    height: "100%",
  },
  cardContainer: {
    padding: 20,

    height: wHeight * 0.85,
    width: wWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    height: wHeight * 0.15,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  buttonView: {
    borderRadius: 50,
    backgroundColor: "white",
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    elevation: 3,
  },
  card: {
    width: 305,
    height: 370,
    elevation: 3,
  },
});
