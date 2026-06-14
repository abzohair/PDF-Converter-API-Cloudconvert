const path = require('path');
const Cloudconvert = require('cloudconvert');
const FormData = require('form-data');
const axios = require('axios');

const { sanitizeFilename } = require('./sanitizeService');

const cloudConvert = new Cloudconvert(process.env.CLOUDCONVERT_API_KEY);

// function sanitizeFilename(file) {
//     const nameFromBuffer = Buffer.from(file, 'latin1').toString('utf8');

//     return path.parse(nameFromBuffer).name
//         .normalize('NFD').trim()
//         .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // supprime caractères dangereux Windows + control chars
//         .replace(/[\s-]+/g, '-'); // espaces + tirets → -
// };

const cloudConvertPDF = async (files) => {

    const result = await Promise.all(

        files.map(async file => {

            const fileName = sanitizeFilename(file.originalname);
            const extname = path.extname(file.originalname);
            const uploadFileName = `${fileName}.${extname}`

            const extension = uploadFileName.split('.').pop().toLowerCase();

            const jobs = await cloudConvert.jobs.create({
                tasks: {
                    import: {
                        operation: 'import/upload'
                    },
                    convert: {
                        operation: 'convert',
                        input: 'import',
                        input_format: extension,
                        output_format: 'pdf'
                    },
                    export: {
                        operation: 'export/url',
                        input: 'convert'
                    }
                }
            });

            // task upload
            const uploadTask = jobs.tasks.find(t => t.name === "import");
            // Vérification de sécurité pour éviter le crash
            if (!uploadTask?.result?.form) throw new Error("CloudConvert n'a pas généré l'URL d'upload");

            const form = uploadTask.result?.form

            // préparation upload
            const formData = new FormData();

            // champs cloudconvert
            Object.entries(form.parameters).forEach(([key, value]) => formData.append(key, value));

            //fichier
            formData.append('file', file.buffer, uploadFileName);

            //upload vers cloudconvert
            await axios.post(form.url, formData, {
                headers: formData.getHeaders()
            });

            // attendre conversion
            return await cloudConvert.jobs.wait(jobs.id);

        })

    );
    const finalResult = result;
    console.dir(finalResult, {
        depth: null,
        colors: true
    });

    return finalResult;

};

module.exports = { cloudConvertPDF };