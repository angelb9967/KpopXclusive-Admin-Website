const mongoose = require('mongoose');

const idolSchema = new mongoose.Schema({
    idolName: String,
    country: String,
    nationality: String,
    fullname: String,
    birthday: String,
    age: Number,
    bloodtype: String,
    height: String,
    group: String,
    debut: String,
    koreanName: String,
    stageName: String,
    status: String,
    trainingPeriod: String,
    zodiacSign: String,
    activeYears: Number,
    education: String,
    fandom: String,
    funFacts: [String],
    introduction: String,
    latestAlbum: String,
    mbti: String,
    musicShowWins: Number,
    socialMediaPlatforms: {
        youtube: String,
        spotify: String,
        tiktok: String,
        instagram: String,
        x: String,
    },
    totalAlbums: Number,
    idolImage: String,
    lastEdited: Date,
    lightstickImage: String,
    companyCurrent: [String],
    companySince: {
        type: Map,
        of: String,
        required: true,
        default: {},
    },
    language: [String],
});

module.exports = mongoose.model('idols', idolSchema);

