const { cloudConvertPDF } = require('../services/cloudConvertService');
const { cloudConvertMergePDF } = require('../services/cloudConvertMergeService');

exports.createPDF = async (req, res) => {

    try {
        const files = req.files;
        if (!files || files.length === 0) return res.status(400).json({ message: 'Au moins un fichiers est requis !' });

        const merge = req.body.merge === "true";

        // mode merge
        if (merge) {
            const mergePDFs = await cloudConvertMergePDF(files);

            return res.status(201).json({
                message: "PDF mergés avec succès !",
                file: mergePDFs
            })
        };

        // mode sans merge
        const convertedPDF = await cloudConvertPDF(files);

        return res.status(201).json({
            message: "PDF créé avec succès !",
            file: convertedPDF
        })


    } catch (error) {

        console.log('Erreur: ', error.cause?.statusText);

        if (error.cause?.status === 402) {

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
