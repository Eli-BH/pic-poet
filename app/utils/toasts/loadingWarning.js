import Toast from "react-native-toast-message";

const loadingWarning = () => {
  Toast.show({
    type: "error",
    text1: "Loading",
    text2: "Please wait for the poem to be generated",
    position: "top",
    autoHide: true,
    visibilityTime: 4000,
  });
};

export default loadingWarning;
