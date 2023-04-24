const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9999' : 'https://api.swapmymood.org'

const configService = {
  apiUrl
}

export default configService
