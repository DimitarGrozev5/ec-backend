import fs from "fs";

export const deleteFile = (fileName: string) => {
  const filePath = `${process.env.uploadDir}/${fileName}`;
  try {
    fs.unlinkSync(filePath);
  } catch (error) {}
};
