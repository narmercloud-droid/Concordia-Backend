import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '../services/upload/s3.js';

export const uploadImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      cb(null, `menu/${Date.now()}.${ext}`);
    }
  })
});
