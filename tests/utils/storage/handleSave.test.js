import handleSave, {
  saveItemsToStorage,
} from "../../../app/utils/storage/handleSave";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import * as MediaLibrary from "expo-media-library";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { captureRef } from "react-native-view-shot";

// Mock setup
jest.mock("expo-file-system", () => ({
  documentDirectory: "file:///mock/path/",
  getInfoAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  copyAsync: jest.fn(),
  EncodingType: { UTF8: "UTF8" },
}));
jest.mock("react-native-uuid", () => ({
  v4: jest.fn(),
}));
jest.mock("expo-media-library", () => ({
  saveToLibraryAsync: jest.fn(),
}));
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(({ onHide }) => {
    onHide(); // Call onHide immediately for testing purposes
  }),
}));
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));
jest.mock("react-native-view-shot", () => ({
  captureRef: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  FileSystem.getInfoAsync.mockResolvedValue({ exists: false });
  FileSystem.writeAsStringAsync.mockResolvedValue(); // Simulate a successful write

  uuid.v4.mockReturnValue("1234-uuid");
  captureRef.mockResolvedValue("data:image/jpg;base64,mockBase64");
  console.error = jest.fn(); // Mock console.error as a jest function
});

describe("handleSave function", () => {
  const mockSetItems = jest.fn();
  const mockItems = [];
  const mockFrontRef = {};
  const mockBackRef = {};
  const title = "Test Title";
  const poem = "Test Poem";

  it("should handle the entire save process correctly", async () => {
    await handleSave(
      mockFrontRef,
      mockBackRef,
      mockItems,
      mockSetItems,
      title,
      poem
    );

    expect(FileSystem.copyAsync).toHaveBeenCalledTimes(2);
    expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalledTimes(2);
    expect(mockSetItems).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "1234-uuid",
          title,
          poem,
          frontViewUri: expect.stringContaining("front_"),
          backViewUri: expect.stringContaining("back_"),
        }),
      ])
    );
    expect(Toast.show).toHaveBeenCalled();
  });

  it("should log an error if saving images fails", async () => {
    const error = new Error("Failed to save");
    captureRef.mockRejectedValue(error);

    await handleSave(
      mockFrontRef,
      mockBackRef,
      mockItems,
      mockSetItems,
      title,
      poem
    );

    expect(console.error).toHaveBeenCalledWith("Failed to save images:", error);
  });
});

describe("saveItemsToStorage function", () => {
  it("should append new item and write to storage", async () => {
    const item = { id: "1234", title: "New Poem" };
    FileSystem.getInfoAsync.mockResolvedValue({ exists: false });

    await saveItemsToStorage(item);

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      "file:///mock/path/savedItems.json",
      JSON.stringify({ data: [item] }),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    expect(Toast.show).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith(`/CardViewPage/${item.id}`);
  });
});
