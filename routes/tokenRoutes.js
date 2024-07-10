const express = require('express');
const {
  createToken,
  likeToken,
  buyToken,
  sellToken,
  supplyToken,
  getToken,
  searchTokens,
  getTokenDetailsById,
  getTokensByUserId
} = require('../controllers/tokenController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

// Route to create a new token with image upload
router.post('/tokens', upload.single('tokenImage'), createToken);

// Other routes
router.post('/tokens/:id/like', likeToken);
router.post('/tokens/:id/buy', buyToken);
router.post('/tokens/:id/sell', sellToken);
router.post('/tokens/:id/supply', supplyToken);
router.get('/tokens/:id', getToken);
router.get('/tokens', searchTokens);

router.get('/tokens/details/:id', getTokenDetailsById);
router.get('/tokens/user/:userId', getTokensByUserId);

module.exports = router;
