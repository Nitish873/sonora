const { ImageKit } = require("@imagekit/nodejs");
const dotenv = require('dotenv');

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();

if (!privateKey) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is missing. Add it to the .env file.');
}

const ImageKitClient = new ImageKit({
    privateKey,
});

async function uploadFile(file) {
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "nitish_backend_yt/music"
    });

    return result;
}

module.exports = {
    uploadFile
};
