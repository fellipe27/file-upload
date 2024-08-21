import { z } from 'zod'

const envSchema = z.object({
    CLOUDFLARE_ACCESS_KEY_ID: z.string(),
    CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
    CLOUDFLARE_ENDPOINT: z.string().url(),
    DATABASE_URL: z.string().url()
})

export const env = envSchema.parse(process.env)
