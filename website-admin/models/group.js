const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: String,
    koreanGroupName: String,
    debut: String,
    debutToFirstWin: String,
    country: String,
    fandom: String,
    companyCurrent: [String],
    companySince: {
        type: Map,
        of: String,
        required: true,
        default: {}
    },
    activeYears: Number,
    status: String,
    musicShowWins: Number,
    totalAlbums: Number,
    latestAlbum: String,
    upcomingAlbum: String,
    groupIntro: String,
    groupImage: String,
    lightstickImage: String,
    socialMediaPlatforms: {
        youtube: String,
        spotify: String,
        tiktok: String,
        instagram: String,
        x: String
    },
    groupMembers: [{
        name: String,
        image: String,
        memberLink: String,
    }],
    lastEdited: Date
});

module.exports = mongoose.model('groups', groupSchema);
