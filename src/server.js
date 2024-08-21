import { fastify } from 'fastify'
import { uploadFile } from './routes/upload-file.js'
import { getUploadedFile } from './routes/get-uploaded-file.js'

const app = fastify()

app.register(uploadFile)
app.register(getUploadedFile)

app.listen({ port: 3333 }).then(() => {
    console.log('🔥 Http server is running...')
})
