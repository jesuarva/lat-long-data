import axios from 'axios'

export default function ServiceManager() {
  let host
  let cachedHeaders
  let kioskManagerAxiosInstance = null
  let recoveryAttempts = 2
  return {
    init(uri, headers = {}) {
      host = uri
      cachedHeaders = headers
      kioskManagerAxiosInstance = axios.create({
        baseURL: host,
        timeout: 2000,
        headers
      })
      return this
    },
    update(headers) {
      kioskManagerAxiosInstance = axios.create({
        baseURL: host,
        timeout: 2000,
        headers: cachedHeaders || headers
      })
      return this
    },
    makeRequest(options) {
      const {
        method,
        endpoint,
        queryParams,
        bodyParams = {},
        cancelRecover = false,
        apiCallControl = 1
      } = options
      return (
        kioskManagerAxiosInstance[method](
          `${endpoint}${getQueryParamsString(queryParams)}`,
          bodyParams
        )
          /* Handle HTTP response errors AND try-to-recover  */
          .catch(async e => {
            if (cancelRecover === true || apiCallControl > recoveryAttempts) {
              /* Stop re-trying to recover */
              handleApiError(e, {
                service: 'Service-Manager',
                endpoint,
                apiCallControl: apiCallControl - 1
              })
            }
            /* Re-try to recover */
            await new Promise(resolve => setTimeout(() => resolve()), 0)
            return this.makeRequest({
              ...options,
              apiCallControl: apiCallControl + 1
            })
          })
      )
    }
  }
}

function getQueryParamsString(queryParams) {
  return queryParams
    ? Object.entries(queryParams).reduce((queryString, [param, value]) => {
        if (!value) return queryString
        if (queryString) {
          queryString += `&${param}=${value}`
        } else {
          queryString += `?${param}=${value}`
        }
        return queryString
      }, '')
    : ''
}

function handleApiError(error, { service, endpoint, apiCallControl = 1 }) {
  if (error.response || error.request) {
    error.message = `${service}: ${error.message}. Number of API calls: ${apiCallControl}`
  } else {
    error.message = `${service}: Unable to trigger request to ${endpoint}. Number of API calls: ${apiCallControl}. ${error.message} `
  }
  throw error
}
