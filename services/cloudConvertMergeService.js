const crypto = require('crypto');
const Cloudconvert = require('cloudconvert');
const FormData = require('form-data');
const axios = require('axios');

const cloudConvert = new Cloudconvert(process.env.CLOUDCONVERT_API_KEY);

const cloudConvertMergePDF = async (files) => {

    //merge mode
    const tasks = {};

    files.forEach((file, index) => {

        const extension = file.originalname.split('.').pop().toLowerCase();
        // upload
        tasks[`import-${index}`] = {
            operation: 'import/upload'
        };
        //convert
        tasks[`convert-${index}`] = {
            operation: 'convert',
            input: `import-${index}`,
            input_format: extension,
            output_format: 'pdf'
        };
    });
    // merge
    tasks.merge = {
        operation: 'merge',
        input: files.map((_, index) => `convert-${index}`),
        output_format: 'pdf'
    };
    // export
    tasks.export = {
        operation: 'export/url',
        input: 'merge'
    };

    // création job merge
    const job = await cloudConvert.jobs.create({ tasks });

    //upload des fichier
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        //trouver l'import d'abord
        const uploadTasks = job.tasks.find(t => t.name === `import-${index}`);
        if (!uploadTasks.result?.form) {
            throw new Error("Le serveur CloudConvert n'a pas encore généré l'URL d'upload. Réessayez.")
        };

        const form = uploadTasks.result?.form;

        const formData = new FormData();

        Object.entries(form.parameters).forEach(([key, value]) => formData.append(key, value));

        formData.append('file', file.buffer, file.originalname);

        await axios.post(form.url, formData, {
            headers: formData.getHeaders()
        });

    };
    return await cloudConvert.jobs.wait(job.id);

};

module.exports = { cloudConvertMergePDF };