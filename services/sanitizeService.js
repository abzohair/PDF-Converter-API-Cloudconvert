const path = require('path')

const sanitizeFilename = (file) => {
    const nameFromBuffer = Buffer.from(file, 'latin1').toString('utf8');

    return path.parse(nameFromBuffer).name
        .normalize('NFD').trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // supprime caractères dangereux Windows + control chars
        .replace(/[\s-]+/g, '-'); // espaces + tirets → -
};

module.exports = { sanitizeFilename }