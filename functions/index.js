const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  function welcome () {
    agent.add('Masuk nih pake firebase webhook')
  }

  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome)
  agent.handleRequest(intentMap)
})

module.exports=app