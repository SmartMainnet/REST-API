import 'dotenv/config'
import express from 'express'
import fileUpload from 'express-fileupload'
import router from './router.js'

const PORT = 5000
const app = express()

app.use(express.json())
app.use(express.static('static'))
app.use(fileUpload({}))
app.use('/api', router)

async function startApp() {
    try {
        app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

startApp()