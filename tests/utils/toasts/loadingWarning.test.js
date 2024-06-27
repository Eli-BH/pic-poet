import Toast from "react-native-toast-message";
import loadingWarning from "../../../app/utils/toasts/loadingWarning";

// Mock the Toast module
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("loadingWarning function", () => {
  it("should display an error toast with appropriate message", () => {
    loadingWarning();

    expect(Toast.show).toHaveBeenCalledWith({
      type: "error",
      text1: "Loading",
      text2: "Please wait for the poem to be generated",
      position: "top",
      autoHide: true,
      visibilityTime: 4000,
    });
  });
});
