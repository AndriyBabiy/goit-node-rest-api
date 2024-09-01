import multer from "multer";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const uniqePrefix = `${Date.now()}_${Math.round(Math.random() * 1e5)}`;
    const filename = `${uniqePrefix}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits = {
  filesize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split(".").pop();
  if (extension === "exe") {
    return callback(HttpError(400, ".exe extension not allowed"));
  }

  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;