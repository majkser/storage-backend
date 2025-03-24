import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = '${Date.now()}-${Math.round(Math.random() * 1E9)}';
        const extension = path.extname(file.originalname);
        cb(null, '${file.fieldname}-${uniqueSuffix}${extension}');
    }
});

export const upload = multer({ storage });