import Pipeline from '@jesuarva/js-pipeline'
import { ServiceManager } from './ServiceManager'

export const SERVICES = {
  sunriseSunset: {
    uri: 'https://api.sunrise-sunset.org',
    endpoint: 'json',
    headers: {}
  }
}

export function sunriseSunsetController({
  points,
  stats,
  latLngList,
  BATCH_NUMBER = 1
}) {
  const { uri, headers, endpoint } = SERVICES['sunriseSunset']
  const service = ServiceManager().init(uri, headers)
  let requestCount = 0
  const requests = Array(BATCH_NUMBER)

  Pipeline(latLngList)
    .effect(() => {
      if (requestCount % BATCH_NUMBER === 0) {
        requests.fill(null)
      }
      if (
        requests.length === BATCH_NUMBER &&
        latLngList.length - requestCount < BATCH_NUMBER
      ) {
        requests.length = latLngList.length - requestCount
      }
    })
    .effect(([lat, lng]) => {
      requests[requestCount % BATCH_NUMBER] = {
        id: `${lat}-${lng}`,
        request: service.makeRequest({
          method: 'get',
          endpoint,
          queryParams: { lat, lng }
        })
      }
      requestCount++
    })
    .filter(
      () =>
        requestCount % BATCH_NUMBER === 0 || requestCount === latLngList.length
    )
    .map(() => {
      return Promise.all(requests.map(({ request }) => request))
        .then(responses => {
          return responses.map(({ data }, index) => [requests[index].id, data])
        })
        .catch(err => {
          console.error({ err })
          return null
        })
    })
    .effect(apiResponses => {
      if (apiResponses) {
        console.log(apiResponses)
        apiResponses.forEach(([pointId, data]) => {
          console.log({ pointId, data })
          points.setPointProperty(pointId, {
            key: 'sunriseSunset',
            value: data.results
          })
        })
      }
    })
    .map(() => {
      return new Promise(resolve => setTimeout(resolve, 5000))
    })
    .runAsync(() => console.log({ points }))
}
