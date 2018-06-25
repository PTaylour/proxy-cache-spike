'use strict'
// @flow

import express from 'express'
import expressBoom from 'express-boom'
import bodyParser from 'body-parser'
import timeout from 'connect-timeout'
import morgan from 'morgan'

const port = process.env.PORT || 5790

let app = express()

app.use(morgan('dev'))

app.use(bodyParser.json({limit: '500kb'}))
app.use(expressBoom())
app.use(timeout('5s'))

app.get('/health', (req, res) => res.status(204).send())

app.all('*', (req, res) => res.status(404).send())

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send(err.message)
  }
})

app.listen(port, () => console.log('listening on port', port))
