import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import * as MediaLibrary from "expo-media-library";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { captureRef } from "react-native-view-shot";

export const saveItemsToStorage = async (item) => {
  const filePath = FileSystem.documentDirectory + "savedItems.json"; // Define the file path

  try {
    let dataObject = { data: [] }; // Default structure if no file exists

    // Check if the file exists and read it
    const fileExists = await FileSystem.getInfoAsync(filePath);
    if (fileExists.exists) {
      const existingContent = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      try {
        const parsedContent = JSON.parse(existingContent); // Try to parse the existing JSON
        if (Array.isArray(parsedContent.data)) {
          dataObject.data = parsedContent.data; // Use existing data
        }
      } catch (parseError) {
        console.error(
          "Error parsing JSON from file, using default structure:",
          parseError
        );
        // If parsing fails, dataObject.data remains an empty array
      }
    }

    // Append the new item to the 'data' array within the object
    dataObject.data.push(item); // Correctly use push to add the item without reassigning dataObject.data

    const jsonValue = JSON.stringify(dataObject); // Convert the updated object back to a JSON string

    // Write the updated JSON string back to the file
    await FileSystem.writeAsStringAsync(filePath, jsonValue, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    Toast.show({
      style: "success",
      text1: "Saved!",
      text2: "Poem saved to gallery!",
      position: "top",
      autoHide: true,
      visibilityTime: 4000,
      onHide: () => {
        router.replace(`/CardViewPage/${item.id}`);
      },
    });
  } catch (e) {
    console.error("Failed to write JSON to storage:", e); // Log an error if writing fails
  }
};

const handleSave = async (frontRef, backRef, items, setItems, title, poem) => {
  try {
    // Capture snapshots
    const frontViewUri = await captureRef(frontRef, {
      format: "jpg",
      quality: 0.8,
    });
    const backViewUri = await captureRef(backRef, {
      format: "jpg",
      quality: 0.8,
    });

    // Define paths for internal storage
    const frontInternalPath =
      FileSystem.documentDirectory + `front_${Date.now()}.jpg`;
    const backInternalPath =
      FileSystem.documentDirectory + `back_${Date.now()}.jpg`;

    // Copy files to internal storage
    await FileSystem.copyAsync({
      from: frontViewUri,
      to: frontInternalPath,
    });
    await FileSystem.copyAsync({
      from: backViewUri,
      to: backInternalPath,
    });

    // Optionally, save to gallery if needed
    await MediaLibrary.saveToLibraryAsync(frontViewUri);
    await MediaLibrary.saveToLibraryAsync(backViewUri);

    // Prepare the new item with internal URIs for app storage
    const newItem = {
      id: uuid.v4(),
      title: title,
      poem: poem,
      frontViewUri: frontInternalPath,
      backViewUri: backInternalPath,
    };

    // Update items state and save to internal JSON storage
    const newItems = [...items, newItem];
    setItems(newItems);
    await saveItemsToStorage(newItem);
  } catch (error) {
    console.error("Failed to save images:", error);
  }
};

export default handleSave;
