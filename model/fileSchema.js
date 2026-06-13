const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true
    },
    uploadUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', FileSchema);