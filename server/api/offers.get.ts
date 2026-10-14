export default defineEventHandler(async (event) => {
  await sleep(500)

  if (shouldFail(event, 'offers')) {
    throw createError({ statusCode: 503, statusMessage: 'Offers unavailable (simulated)' })
  }

  setResponseHeader(event, 'Cache-Control', 'no-store')
  return OFFERS
})
