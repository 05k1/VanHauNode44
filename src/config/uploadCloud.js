import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const storage = new CloudinaryStorage({
  cloudinary,
  // allowedFormats: ["jpg", "png"],
  // allowedFormats: ["jpg", "png", "webp"],
  // transformation: [{ format: "jpg" }], // Chuyển đổi tất cả tệp thành jpg
  params: {
    folder: "avatar",
    format: async (req, file) => {
      const validImgFormat = ["png", "jpeg", "gif", "webp", "jpg"];

      const fileFormat = file.mimetype.split("/")[1];

      if (validImgFormat.includes(fileFormat)) {
        return fileFormat;
      }

      return ".png";
    },
    transformation: [
      {
        width: 800, // gioi han chieu rong anh
        quality: "auto:good", // chat luong tu dong tot
        fetch_format: "auto", // tu dong chon dinh dang tot nhat (webp)
      },
    ],
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const uploadCloud = multer({ storage });

export default uploadCloud;
