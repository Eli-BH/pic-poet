import { router } from "expo-router";

export function extractFilename(path) {
  const lastSlashIndex = path.lastIndexOf("/");
  const filenameWithExtension = path.substring(lastSlashIndex + 1);

  const dotIndex = filenameWithExtension.lastIndexOf(".");
  if (dotIndex === -1) {
    return filenameWithExtension; // Return as is if no dot is found
  }

  const filename = filenameWithExtension.substring(0, dotIndex);
  return filename;
}

const takePhoto = async (camera) => {
  if (!camera || camera.current === null) {
    return;
  }

  if (camera.current) {
    // Take the picture
    const photo = await camera.current.takePictureAsync();

    const filename = extractFilename(photo.uri);

    router.push(`/PreviewPage/${filename}`);
  }
};

export default takePhoto;
