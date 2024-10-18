import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '../lib/cloudflare.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'

export async function getUploadedFile(app) {
    app.get('/uploads/:id', async (request) => {
        const getFileParamsSchema = z.object({
            id: z.string().cuid()
        })

        const { id } = getFileParamsSchema.parse(request.params)

        const file = await prisma.file.findFirstOrThrow({
            where: { 
                id
            }
        })

        const downloadUrl = getSignedUrl(
            r2,
            new GetObjectCommand({
                Bucket: 'file-upload',
                Key: file.key
            }),
            { expiresIn: 600 }
        )

        return downloadUrl
    })
}
