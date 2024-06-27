import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

const encodeImage = async (imagePath) => {
  let base64Photo = await FileSystem.readAsStringAsync(`${imagePath}`, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64Photo;
};

const generatePoem = async (formattedPath, setPoem, setTitle, setLoading) => {
  try {
    setLoading(true);
    const token = await SecureStore.getItemAsync("api_key");

    const getQuery = await fetch(
      "https://pic-poet-server-dc020df3cea7.herokuapp.com/api/get-query"
    );
    const data = await getQuery.json();

    const query = data.query;

    // getting the base64 string and making the api call to
    encodeImage(formattedPath).then((base64Image) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: query,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      };

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          // Extract and remove title enclosed in asterisks
          const match = data?.choices[0]?.message?.content.match(/\*+(.*?)\*+/);
          const title = match ? match[1] : null;

          setTitle(title);

          setPoem(data.choices[0].message.content);

          setLoading(false);

          Toast.show({
            type: "info",
            text1: "Poem Generated",
            text2: "Tap the photo to flip the card and view your poem !",
            position: "top",
            autoHide: true,
            visibilityTime: 4000,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please try again",
            position: "top",
            autoHide: true,
            visibilityTime: 4000,
          });
          setLoading(false);
        });
    });
  } catch (error) {
    console.error("Error:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Please try again",
      position: "top",
      autoHide: true,
      visibilityTime: 4000,
    });
    setLoading(false);
  }
};

export default generatePoem;
