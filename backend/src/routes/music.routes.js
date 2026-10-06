const express = require('express');
const { createMusic, albumMusic, getAllMusic , getAllAlbums , getAlbumById} = require('../controllers/music.controller');
const multer = require('multer');
const { authArtist, authUser } = require('../middleware/auth.middleware');

const upload = multer({
    storage: multer.memoryStorage(),
})


const router = express.Router();

// Postman can send the file under any of these common field names.
const uploadMusic = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'music', maxCount: 1 }
]);


router.post('/upload', authArtist, uploadMusic, (req, res, next) => {
    req.file = req.files?.file?.[0] || req.files?.audio?.[0] || req.files?.music?.[0];
    next();
}, createMusic);

router.post('/album', authArtist, albumMusic);

router.get('/', getAllMusic); 
router.get('/albums', getAllAlbums);
router.get('/albums/:id', getAlbumById);




module.exports = router;
