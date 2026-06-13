const { cloudConvertPDF } = require('../services/cloudConvertService');
const { cloudConvertMergePDF } = require('../services/cloudConvertMergeService');
const { getPDFService } = require('../services/getservice/getpdfs');

// const CloudConvert = require('cloudconvert');

// const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

exports.createPDF = async (req, res) => {

    try {
        const files = req.files;
        if (!files || files.length === 0) return res.status(400).json({ message: 'Au moins un fichiers est requis !' });

        const merge = req.body.merge === "true";

        // merge mode
        if (merge) {
            const mergePDFs = await cloudConvertMergePDF(files);

            return res.status(201).json({
                message: "PDF mergés avec succès !",
                file: mergePDFs
            })
        };

        // without merge mode
        const convertedPDF = await cloudConvertPDF(files);

        // console.dir(convertedPDF, {
        //     depth: null,
        //     colors: true
        // });

        return res.status(201).json({
            message: "PDF créé avec succès !",
            file: convertedPDF
        })


    } catch (error) {

        if (error.cause?.status === 402) {
            console.log('Erreur: ', error.cause?.statusText);

            return res.status(402).json({
                success: false,
                code: 'PAYMENT_REQUIRED',
                message:
                    'Votre compte CloudConvert ne possède plus assez de crédits.'
            });

        }
        console.log('Erreur: ', error);
        return res.status(500).json({
            message: error.message
        });

    }
};

exports.getPDFs = async (req, res) => {

    try {
        const id = req.params.id;

        const exportTask = await getPDFService(id);

        if (exportTask.status !== 'finished') {
            return (res.status(400).json({
                success: true,
                status: exportTask.status,
                message: "Fichier pas encore prêt !"
            }));
        };

        const file = exportTask?.result?.files[0];
        return res.status(200).json({
            message: "PDF envoyé avec succès !",
            success: true,
            filename: file?.filename,
            url: file?.url,
        })


    } catch (error) {
        console.log('Erreur: ', error);

        if (error.cause?.status === 402) {
            console.log('Erreur: ', error.cause?.statusText);
            return res.status(402).json({
                success: false,
                code: 'PAYMENT_REQUIRED',
                message:
                    'Votre compte CloudConvert ne possède plus assez de crédits.'
            });
        }

        return res.status(500).json({
            message: error.message
        });

    }
};