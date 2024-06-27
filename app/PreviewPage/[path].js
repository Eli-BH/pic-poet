import React, { useRef, useState } from "react";
import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ImageBackground, Image, Text, Pressable } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import CardFlip from "react-native-card-flip";
import generatePoem from "../utils/poem/generatePoem";
import loadingWarning from "../utils/toasts/loadingWarning";
import handleSave from "../utils/storage/handleSave";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Route = () => {
  const [poem, setPoem] = useState("");
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]); // Initialize items state with an empty array
  const [loading, setLoading] = useState(false);

  const { path } = useLocalSearchParams();
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const formattedPath = `file:///data/user/0/com.cosmicavian.picpoet/cache/Camera/${path}.jpg`;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <ImageBackground
          source={require("../../assets/ikhlas-rahman-rIEA6hYEFYY-unsplash.jpg")}
          style={styles.background}
        >
          {poem ? (
            <CardFlip style={styles.card} ref={(card) => (this.card = card)}>
              <Pressable onPress={() => this.card.flip()}>
                <View style={styles.frontCard} ref={frontRef}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: `file://${formattedPath}` }}
                      style={styles.image}
                    />
                  </View>

                  <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                  </View>
                </View>
              </Pressable>
              <Pressable onPress={() => this.card.flip()}>
                <ScrollView
                  contentContainerStyle={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                  style={styles.backCard}
                  ref={backRef}
                >
                  <Text style={styles.poemText}>{poem}</Text>
                </ScrollView>
              </Pressable>
            </CardFlip>
          ) : (
            <View style={styles.basicFront}>
              <View style={styles.basicImageContainer}>
                <Image
                  source={{ uri: `file://${formattedPath}` }}
                  style={styles.basicImage}
                />
              </View>

              <View style={styles.loadingContainer}>
                {loading ? (
                  <Image
                    source={require("../../assets/1484.gif")}
                    style={styles.loadingGif}
                  />
                ) : (
                  <></>
                )}
              </View>
            </View>
          )}
          <View style={styles.basicBack}>
            <Pressable
              onPress={() =>
                poem
                  ? handleSave(frontRef, backRef, items, setItems, title, poem)
                  : !loading
                  ? generatePoem(formattedPath, setPoem, setTitle, setLoading)
                  : loadingWarning()
              }
            >
              <View style={styles.downloadButton}>
                <FontAwesome
                  name={poem ? "download" : "pencil-square-o"}
                  size={32}
                  color="white"
                />
              </View>
            </Pressable>

            <Pressable
              style={{
                elevation: 5,
              }}
              onPress={() => router.replace("/CameraPage")}
            >
              <View style={styles.redo}>
                <FontAwesome5 name="redo" size={32} color="white" />
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  cardFrontBody: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#64676e",
    width: windowWidth * 0.8,
    height: windowHeight * 0.3,
    borderRadius: 10,
  },
  cardArea: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth * 0.9,
    height: windowHeight * 0.5,
  },
  cardBackBody: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#64676e",
    width: windowWidth * 0.8,
    height: windowHeight * 0.3,
    borderRadius: 10,
  },
  frontCard: {
    height: windowHeight * 0.3,
  },
  backCard: {
    height: windowHeight * 0.3,
  },
  innerContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  background: {
    resizeMode: "cover",
    height: "100%",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  frontCard: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    height: windowHeight * 0.58,
    width: windowWidth * 0.9,
    paddingTop: 20,
    gap: 15,
    marginLeft: "auto",
    marginRight: "auto",
    borderWidth: 2,
    borderRadius: 2,
    elevation: 5,
  },
  imageContainer: {
    height: 305,
    width: 305,
    borderRadius: 2,
    borderWidth: 5,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    zIndex: 0,
    height: 300,
    width: 300,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    color: "#303030",
    fontFamily: "PermanentMarker_400Regular",
    letterSpacing: 1,
    marginLeft: 0,
    textAlign: "left",
    transform: [{ translateY: 12 }],
  },
  backCard: {
    backgroundColor: "white",
    height: windowHeight * 0.55,
    width: windowWidth * 0.9,
    borderWidth: 2,
    borderRadius: 2,
    gap: 15,
    marginLeft: "auto",
    marginRight: "auto",
    elevation: 5,
  },
  poemText: {
    fontSize: 12,
    fontFamily: "sans-serif",
    letterSpacing: 1,
    textAlign: "left",
    padding: 15,
  },
  basicFront: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    height: windowHeight * 0.58,
    width: windowWidth * 0.9,
    borderWidth: 2,
    paddingTop: 20,
    gap: 15,
    marginLeft: "auto",
    marginRight: "auto",
    elevation: 5,
  },
  basicImageContainer: {
    height: 305,
    width: 305,
    borderRadius: 2,
    borderWidth: 5,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  basicImage: {
    zIndex: 0,
    height: 300,
    width: 300,
  },
  loadingGif: {
    height: 100,
    width: 100,
    borderRadius: 5,
  },
  loadingContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  basicBack: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 80,
    justifyContent: "space-between",
  },
  downloadButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 5,
    padding: 10,
    borderWidth: 2,
  },
  redo: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 5,
    padding: 10,
    borderWidth: 2,
  },
});

export default Route;
