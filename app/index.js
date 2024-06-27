import { View, StyleSheet, ImageBackground, FlatList } from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

export default function Page() {
  const [items, setItems] = useState([]);
  const loadItemsFromStorage = async () => {
    const filePath = FileSystem.documentDirectory + "savedItems.json";

    // Check if the file exists before trying to read it
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      console.log("File does not exist, creating a new one with empty data");
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify({ data: [] }),
        {
          encoding: FileSystem.EncodingType.UTF8,
        }
      );
      return [];
    }

    try {
      const jsonValue = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const dataObject = JSON.parse(jsonValue);
      return dataObject.data || [];
    } catch (e) {
      console.error("Failed to read JSON from storage:", e);
      return [];
    }
  };

  useEffect(() => {
    loadItemsFromStorage().then((loadedItems) => {
      setItems(loadedItems); // Now this will properly set the items array from the 'data' key
    });
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/ikhlas-rahman-rIEA6hYEFYY-unsplash.jpg")}
        style={{
          resizeMode: "cover",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "80%",
            alignItems: "center",
            justifyContent: "center",
            padding: 15,
            paddingTop: 50,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              borderRadius: 10,
              borderWidth: 2,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                padding: 10,
                alignItems: "center",
                justifyContent: "space-evenly",

                gap: 10,
                borderRadius: 5,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              <FlatList
                style={{
                  width: "100%",

                  padding: 10,
                }} // Set a specific width
                data={items}
                numColumns={2}
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "flex-start",

                  gap: 20,
                }}
                key={2}
                columnWrapperStyle={{
                  width: "100%",

                  alignItems: "flex-start",
                  gap: 30,
                }}
                keyExtractor={(item) => item.id || item.frontViewUri}
                renderItem={({ item }) => (
                  <Link href={`/CardViewPage/${item.id}`}>
                    <Image
                      source={{ uri: item.frontViewUri }}
                      style={{
                        height: 170,
                        borderRadius: 3,
                        width: 140,
                        borderWidth: 2,
                      }}
                      contentFit="cover"
                    />
                  </Link>
                )}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            height: "20%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link href="/CameraPage">
            <View
              style={{
                backgroundColor: "white",
                width: 90,
                height: 90,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                elevation: 3,
              }}
            >
              <AntDesign name="camera" size={36} color="black" />
            </View>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
