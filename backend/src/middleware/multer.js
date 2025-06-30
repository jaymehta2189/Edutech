import multer from 'multer';
import { storage } from '../service/cloudinary.config.js'; // adjust path

const upload = multer({ storage });

export default upload;
