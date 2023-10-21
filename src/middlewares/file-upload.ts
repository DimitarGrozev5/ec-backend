import multer from "multer";

// Multer Configuration for File storage
const storage = multer.diskStorage({
  destination: process.env.uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export const fileUploadMiddleware = (fieldName: string) =>
  upload.single(fieldName);
