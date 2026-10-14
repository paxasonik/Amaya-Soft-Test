import { readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

// Только для dev: отдаёт PNG из design/Paywall для оверлея сверки с макетом (?overlay)
export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404 })
  }
  const name = basename(getRouterParam(event, 'name') ?? '')
  try {
    const file = await readFile(join(process.cwd(), 'design', 'Paywall', name))
    setResponseHeader(event, 'Content-Type', 'image/png')
    return file
  }
  catch {
    throw createError({ statusCode: 404 })
  }
})
