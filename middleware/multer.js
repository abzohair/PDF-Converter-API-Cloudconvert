// const multer = require('multer');

// const storage = multer.memoryStorage();

// // const fileFilter = (req, file, cb) => {
// //     const allowedTypes = [
// //         // Images
// //         "image/jpeg",
// //         "image/jpg",
// //         "image/png",
// //         "image/webp",

// //         // PDF
// //         "application/pdf",

// //         // Word
// //         "application/msword",
// //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

// //         // Excel
// //         "application/vnd.ms-excel",
// //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

// //         // Text
// //         "text/plain"
// //     ];
// //     if (allowedTypes.includes(file.mimetype)) {
// //         cb(null, true)
// //     } else {
// //         cb(null, false);
// //     }
// // }

// // const upload = multer({
// //     storage,
// //     fileFilter,
// // }).array('files');

// const upload = multer({ storage }).single('file');

// module.exports = upload;


const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage }).array('files');

module.exports = upload;
