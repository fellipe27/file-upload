import fastify from 'fastify'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '../lib/cloudflare.js'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import cors from '@fastify/cors'

const app = fastify()
app.register(cors)

const prisma = new PrismaClient({
    log: ['query']
})

app.post('/uploads', async (request) => {
    const uploadBodySchema = z.object({
        name: z.string().min(1),
        contentType: z.string().regex(/\w+\/[-+.\w]+/)
    })
 
    const { name, contentType } = uploadBodySchema.parse(request.body)
    const fileKey = randomUUID().concat('-').concat(name)

    const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
            Bucket: 'file-upload',
            Key: fileKey,
            ContentType: contentType
        }),
        { expiresIn: 600 }
    )

    const file = await prisma.file.create({
        data: {
            name,
            contentType,
            key: fileKey
        }
    })

    return { signedUrl, fileId: file.id }
})

app.get('/uploads/:id', async (request) => {
    const getFileParamsSchema = z.object({
        id: z.string().cuid()
    })

    const { id } = getFileParamsSchema.parse(request.params)

    const file = await prisma.file.findUniqueOrThrow({
        where: {
            id
        }
    })

    const signedUrl = await getSignedUrl(
        r2,
        new GetObjectCommand({
            Bucket: 'file-upload',
            Key: file.key,
        }),
        { expiresIn: 600 }
    )

    return signedUrl
})

app.listen({
    port: 3333,
    host: '0.0.0.0'
}).then(() => {
    console.log('Http server is running...')
})
