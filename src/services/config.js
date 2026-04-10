const apiUrl = process.env.VUE_APP_API_URL || process.env.VUE_APP_BASE_API || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5001/swapmymood-dev-1d2b9/us-central1/app' : 'https://api.swapmymood.org')

const configService = {
  apiUrl
}

export default configService
