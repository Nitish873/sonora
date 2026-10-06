const musicModel = require('../models/music.model');
const uploadFile = require('../services/storage.service').uploadFile;
const albumModel = require('../models/album.model');

async function createMusic(req,res){
    try {
        const {uri} = req.body;
        const file = req.file;

        if(!file){
            return res.status(400).json({message : 'File is required'});
        }

        const result = await uploadFile(file.buffer.toString('base64'));

        const music = new musicModel({
            uri : result.url,
            title : file.originalname,
            artist : req.user._id
        })

        await music.save();
        return res.status(201).json({message : 'Music uploaded successfully', music});
    } catch (err) {
        console.error('Music upload failed:', err.message);
        return res.status(500).json({message : 'Internal server error'});
    }
}

async function albumMusic(req,res){
    try{
        const {title , musics} = req.body;

        if (!title || !Array.isArray(musics) || musics.length === 0) {
            return res.status(400).json({message : 'Title and a non-empty musics array are required'});
        }

        const album = new albumModel({
            title,
            artist : req.user._id,
            musics
        })
        await album.save();
        return res.status(201).json({message : 'Album created successfully', album});
    }

    catch(err){
        console.log(err);
        return res.status(500).json({message : 'Internal server error'});
    }
}

const DEMO_TRACKS = [
    {
        _id: 'demo-1',
        title: 'Midnight Echoes',
        artist: { name: 'Luna Wave' },
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
        _id: 'demo-2',
        title: 'Neon Drift',
        artist: { name: 'Solar Pulse' },
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
        _id: 'demo-3',
        title: 'Velvet Horizon',
        artist: { name: 'Aetheria' },
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
        _id: 'demo-4',
        title: 'Starlight Reverie',
        artist: { name: 'Cosmo Static' },
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    }
];

async function getAllMusic(req,res){
    try {
        let musics = await musicModel.find().limit(20).populate('artist', 'name');
        if (!musics || musics.length === 0) {
            musics = DEMO_TRACKS;
        }
        res.status(200).json({musics});
    } catch (err) {
        console.error('getAllMusic error:', err.message);
        res.status(200).json({musics: DEMO_TRACKS});
    }
}


async function getAllAlbums(req,res){
    try {
        const albums = await albumModel.find().select("title artist").populate('artist', 'name').populate('musics', 'title');
        res.status(200).json({albums});
    } catch (err) {
        res.status(200).json({albums: []});
    }
}

async function getAlbumById(req,res){
    try {
        const { id } = req.params;
        const album = await albumModel.findById(id).populate('artist', 'name').populate('musics', 'title');

        if(!album){
            return res.status(404).json({message : 'Album not found'});
        }

        res.status(200).json({album});
    } catch (err) {
        res.status(500).json({message: 'Failed to fetch album'});
    }
}





module.exports={
    createMusic,
    albumMusic,
    getAllMusic,
    getAllAlbums,
    getAlbumById
}

