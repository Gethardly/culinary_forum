import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import config from './config';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const destDir = path.join(config.publicPath, 'images');
    const avatarsDir = path.join(destDir, 'avatars');
    const recipePhotosDir = path.join(destDir, 'recipe_photos');

    await fs.mkdir(destDir, { recursive: true });
    await fs.mkdir(avatarsDir, { recursive: true });
    await fs.mkdir(recipePhotosDir, { recursive: true });

    if (_file.fieldname === 'avatar') {
      cb(null, avatarsDir);
    } else if (_file.fieldname === 'photoGallery') {
      cb(null, recipePhotosDir);
    }
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, randomUUID() + extension);
  },
});

export const imagesUpload = multer({ storage: imageStorage });
