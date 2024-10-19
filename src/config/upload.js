import multer, { diskStorage } from "multer";

export const upload = multer({
  storage: diskStorage({
    destination: process.cwd() + "/public/imgs", // tra ve duong dan root project
    filename: (req, file, callback) => {
      // timestamp_img_name
      let newName = new Date().getTime() + "_" + file.originalname;
      callback(null, newName);
    },
  }),
});
