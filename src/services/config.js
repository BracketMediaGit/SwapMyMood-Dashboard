const apiUrl = process.env.VUE_APP_API_URL || process.env.VUE_APP_BASE_API || (process.env.NODE_ENV === 'development' ? 'http://localhost:9999' : 'https://api.swapmymood.org')

const configService = {
  apiUrl
}

export default configService
