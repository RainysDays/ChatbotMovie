const functions = require('firebase-functions')
const app = require('./index')

exports.app = functions.https.onRequest(app)