import { connect } from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  if (!config.mongodbUri) {
    console.error('Connection string not provided')
    return
  }
  try {
    await connect(config.mongodbUri)
    console.log('DB connected')
  } catch (error) {
    console.log('DB connection failed: ', error)
  }
})
