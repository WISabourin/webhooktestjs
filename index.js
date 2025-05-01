/**
 * webhooktestjs    : Simple webhook server that will create test webhooks on the fly
 *
 * /new-webhook     : Creates a new listener using a UID
 *                  :       Example http://localhost:3000/new-webhook
 *                  : Returns uid representing the webhook listener
 * /webhooks        : Returns all webhook listeners
 * /events/:id      : Returns a all events for a specific webhook
 *                  :       Example http://localhost:3000/029736f5-9b9e-43ca-8bec-d0148e94e916
 *                          JSON object returned {"Key": "pair"}
 * /remove          : Removes all webhooks listeners and events
 *
 */

import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(bodyParser.json())

let events = []     // Array to store events
let listeners = []  // Array to store webhook endpoints

// Route to get all registered webhooks
app.get('/webhooks', (req, res) => {
    res.json(listeners)
    console.log(`Returned all webhooks:\n${listeners}\n`)
})

// Route to get events by ID
app.get('/events/:id', (req, res) => {
    const id = req.params.id
    // Filter and remove all the uid
    let tempEvents = JSON.parse(JSON.stringify(events))
    let eventById = tempEvents.filter((event) => event.test_webhook_uid === id)
    eventById = eventById.map((obj) => {
        delete obj.test_webhook_uid
        return obj
    })

    console.log(events)
    res.json(eventById)
    console.log(`Returned all events for ${id}\n${JSON.stringify(eventById)}\n`)
})

// Function to remove a specific webhook listener endpoint
function removeEndpoint(endpoint) {
    // Filtering out the endpoint from Express router stack
    app._router.stack = app._router.stack.filter((layer) => {
        return !(layer.route && layer.route.path === endpoint)
    })
    console.log(`Removed endpoint: ${endpoint}\n`)
}

// Route to remove all webhook listeners and events
app.get('/remove', (req, res) => {
    listeners.forEach((endpoint) => removeEndpoint('/' + endpoint))
    listeners = []
    events = []
    res.send('All webhooks removed.')
    console.log(`Removed all hooks and events\n`)
})

// Route to set up a webhook
app.get('/new-webhook', (req, res) => {
    const uid = uuidv4()
    listeners.push(uid)
    const webhookURL = '/' + uid
    app.post(webhookURL, (req, res) => {
        const event = req.body
        event.test_webhook_uid = uid
        events.push(event)
        res.status(200).send('Event received on webhook URL')
    })
    res.send(uid)
    console.log(`Created webhook: ${uid}\n`)
})

// Read and set the server port
const PORT = process.env.HOOKSJS_PORT || 3000
// SSL Certificate Options
const useSSL = process.env.HOOKSJS_USE_SSL === 'true'

if (useSSL) {
    const https = require('https')
    const fs = require('fs')

    // SSL Certificate Options
    const options = {
        key: fs.readFileSync(process.env.HOOKSJS_SSL_PRIVATE_KEY),
        cert: fs.readFileSync(process.env.HOOKSJS_SSL_CERTIFICATE)
    }

    // Create HTTPS server
    const httpsServer = https.createServer(options, app).listen(PORT, () => {
        console.log(`HTTPS Server is running on https://localhost:${PORT}\n`)
    })
} else {
    // Create HTTP server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}\n`)
    })
}
