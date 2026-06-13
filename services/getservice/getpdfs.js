const CloudConvert = require('cloudconvert');

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

const getPDFService = async (id) => {

    const job = await cloudConvert.jobs.get(id);

    const exportTask = job.tasks.find(t => t.name === 'export');
    if (!exportTask) throw Error("Aucun task export trouvé !");

    console.dir(exportTask, {
        depth: null,
        colors: true
    });

    return exportTask;

};

module.exports = { getPDFService };