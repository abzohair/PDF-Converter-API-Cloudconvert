const crypto = require('crypto');
const Cloudconvert = require('cloudconvert');
const FormData = require('form-data');
const axios = require('axios');

const cloudConvert = new Cloudconvert(process.env.CLOUDCONVERT_API_KEY);

const cloudConvertPDF = async (files) => {

    const result = await Promise.all(

        files.map(async file => {

            const extension = file.originalname.split('.').pop().toLowerCase();

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

            const form = uploadTask.result?.form;

            // préparation upload
            const formData = new FormData();

            // champs cloudconvert
            Object.entries(form.parameters).forEach(([key, value]) => formData.append(key, value));

            //fichier
            formData.append('file', file.buffer, file.originalname);

            //upload vers cloudconvert
            await axios.post(form.url, formData, {
                headers: formData.getHeaders()
            });

            // attendre conversion
            return await cloudConvert.jobs.wait(jobs.id);

        })

    );
    return result;

};

module.exports = { cloudConvertPDF };