import takePhoto, {
  extractFilename,
} from "../../../app/utils/camera/takePhoto"; // Adjust the import path to the file where takePhoto is defined.
import { router } from "expo-router";

// Mock the 'expo-router'
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("extractFilename function", () => {
  it("should extract the filename without extension", () => {
    const path = "/some/random/path/image.jpg";
    expect(extractFilename(path)).toEqual("image");
  });

  it("should handle paths without a file extension", () => {
    const path = "/some/random/path/image";
    expect(extractFilename(path)).toBe("image");
  });

  it("should handle filenames with multiple dots", () => {
    const path = "/some/random/path/image.version2.jpg";
    expect(extractFilename(path)).toBe("image.version2");
  });

  it("should return empty string if there is no filename", () => {
    const path = "/some/random/path/";
    expect(extractFilename(path)).toBe("");
  });
});
describe("takePhoto function", () => {
  let mockCamera;

  // Setup a fresh mock camera before each test
  beforeEach(() => {
    mockCamera = {
      current: {
        takePictureAsync: jest.fn(),
      },
    };
    jest.clearAllMocks(); // Ensure all mocks are cleared
  });

  it("should call router.push with the extracted filename", async () => {
    const photoUri = "/path/to/photo/img1234.png";
    mockCamera.current.takePictureAsync.mockResolvedValue({ uri: photoUri });

    await takePhoto(mockCamera); // Pass the local mockCamera

    expect(mockCamera.current.takePictureAsync).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith("/PreviewPage/img1234");
  });

  it("should not do anything if camera is not available", async () => {
    // Here, mock a scenario where camera.current is null
    const unavailableCamera = { current: null };

    await takePhoto(unavailableCamera); // Pass the specifically mocked unavailable camera

    expect(unavailableCamera.current?.takePictureAsync).toBeUndefined();
    expect(router.push).not.toHaveBeenCalled();
  });
});
