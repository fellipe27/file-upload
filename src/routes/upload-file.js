import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '../lib/cloudflare.js'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { prisma } from '../lib/prisma.js'
import axios from 'axios'
import fs from 'node:fs'

export async function uploadFile(app) {
    app.put('/uploads', async (request, reply) => {
        const uploadBodySchema = z.object({
            name: z.string().min(1),
            contentType: z.string().regex(/\w+\/[-+.\w]+/),
            filePath: z.string()
        })
        
        const { name, contentType, filePath } = uploadBodySchema.parse(request.body)
        const fileKey = randomUUID().concat('-').concat(name)
    
        const signedUrl = await getSignedUrl(
            r2,
            new PutObjectCommand({
                Bucket: 'file-upload',
                Key: fileKey,
                ContentType: 'video/mp4'
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
    
        try {
            const fileStream = fs.createReadStream(filePath)
            const fileSize = fs.statSync(filePath).size

            await axios.put(signedUrl, fileStream, {
                headers: {
                    'Content-Type': contentType,
                    'Content-Length': fileSize
                }
            })
        } catch(error) {
            throw new Error('File not found or upload problem.')
        }

        return reply.status(201).send({ fileId: file.id })
    })
}
