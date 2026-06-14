# PDF Converter API Cloudconvert

API REST développée avec **Node.js** permettant la conversion de fichiers vers le format PDF grâce à **CloudConvert**. L'API prend en charge deux modes de fonctionnement :

* Conversion simple de plusieurs fichiers en PDF
* Fusion (*merge*) de plusieurs fichiers PDF en un seul document

Cette solution est idéale pour intégrer rapidement des fonctionnalités de génération et de fusion de PDF dans une application web ou mobile.

---

# Fonctionnalités

## Conversion de fichiers en PDF

L'API permet de convertir un ou plusieurs fichiers compatibles vers le format PDF via CloudConvert.

### Formats supportés

CloudConvert prend en charge de nombreux formats :

* DOC
* DOCX
* XLS
* XLSX
* PPT
* PPTX
* ODT
* JPG
* PNG
* HTML
* TXT
* et bien d'autres

---

## Fusion de PDF (Merge)

Lorsque le paramètre `merge=true` est envoyé dans la requête :

* Tous les fichiers envoyés sont convertis en PDF si nécessaire.
* Les PDF générés sont fusionnés en un seul document.
* Un unique fichier PDF est retourné.

---

## Récupération du PDF généré

Une route dédiée permet de vérifier l'état du traitement CloudConvert et récupérer l'URL finale du document PDF.

---

# Architecture du projet

```bash
src/
│
├── controllers/
│   └── pdfController.js
│
├── services/
│   ├── cloudConvertService.js
│   ├── cloudConvertMergeService.js
│   ├── sanitizeService.js
│   └── getservice/
│       └── getpdfs.js
│
├── routes/
│   └── pdfRoutes.js
│
├── middlewares/
│   └── multer.js
│
├── app.js
└── server.js
```

---

# Installation

## Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/pdf-converter-api.git

cd pdf-converter-api
```

## Installer les dépendances

```bash
npm install
```

## Lancer le projet

```bash
nodemon server

---

# Variables d'environnement

Créer un fichier `.env` :

```env
PORT = process.env.PORT || 4000

CLOUDCONVERT_API_KEY=your_cloudconvert_api_key
```

---

# Configuration CloudConvert

Créer un compte :

https://cloudconvert.com

Récupérer votre clé API :

Dashboard → API Keys

Ajouter ensuite la clé dans le fichier `.env`.

---

# API Endpoints

## 1. Créer un PDF

### Endpoint

```http
POST /api/pdf
```

### Paramètres

| Nom   | Type    | Obligatoire | Description          |
| ----- | ------- | ----------- | -------------------- |
| files | File[]  | Oui         | Fichiers à convertir |
| merge | Boolean | Non         | Fusionner les PDF    |

---

# Récupérer le PDF généré

Une fois le traitement terminé sur CloudConvert, récupérer le document grâce à son identifiant.

## Endpoint

```http
GET /api/pdf/:id
```

### Exemple

```http
GET /api/pdf/123456789
```

---

# Gestion des erreurs

## Crédits CloudConvert épuisés

```json
{
  "success": false,
  "code": "PAYMENT_REQUIRED",
  "message": "Votre compte CloudConvert ne possède plus assez de crédits."
}
```

### Code HTTP

```http
402 Payment Required
```

---

## Erreur serveur

```json
{
  "message": "Erreur interne du serveur"
}
```

### Code HTTP

```http
500 Internal Server Error
```

---

# Workflow

## Conversion simple

```text
Upload fichiers
        │
        ▼
CloudConvert
        │
        ▼
Conversion PDF
        │
        ▼
Retour Task ID
        │
        ▼
GET /api/pdf/:id
        │
        ▼
URL du PDF
```

---

## Conversion + Fusion

```text
Upload fichiers
        │
        ▼
Conversion PDF
        │
        ▼
Merge PDF
        │
        ▼
Retour Task ID
        │
        ▼
GET /api/pdf/:id
        │
        ▼
PDF fusionné
```

---

# Technologies utilisées

* Node.js
* Express.js
* Multer
* CloudConvert API
* dotenv

---

# Sécurité

Bonnes pratiques recommandées :

* Limiter la taille des fichiers uploadés
* Vérifier les extensions autorisées
* Mettre en place un Rate Limiter
* Masquer les clés API via les variables d'environnement

---

# Améliorations futures

* Développer un client frontend
* Déployer une DATABASE
* Authentification JWT
* Historique des conversions
* Suppression automatique des fichiers temporaires
* Webhooks CloudConvert

---

# Auteur

Développé par https://abdellaoui-portfolio.vercel.app/ avec Node.js et CloudConvert pour fournir une API rapide et scalable de conversion et fusion PDF.
