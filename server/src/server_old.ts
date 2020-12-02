import express from 'express'
import mongoose from 'mongoose'

import routes from './routes'

const app = express()
app.use(express.json())

// mongoose.connect("mongodb://localhost/todo-list", {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

app.use('/api/', routes)

app.listen('3333')

export default app;