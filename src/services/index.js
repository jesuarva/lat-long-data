import moment from 'moment'
import Pipeline from '@jesuarva/js-pipeline'
import { ServiceManager } from './ServiceManager'

export const SERVICES = {
  sunriseSunset: {
    uri: 'https://api.sunrise-sunset.org',
    endpoint: 'json',
    headers: {}
  }
}

export function sunriseSunsetController({ points, stats, latLngList, BATCH_NUMBER = 1 }) {
  const { uri, headers, endpoint } = SERVICES['sunriseSunset']
  const service = ServiceManager().init(uri, headers)
  let requestCount = 0
  const requests = Array(BATCH_NUMBER)

  Pipeline(latLngList)
    .effect(() => {
      if (requestCount % BATCH_NUMBER === 0) {
        requests.fill(null)
      }
      if (requests.length === BATCH_NUMBER && latLngList.length - requestCount < BATCH_NUMBER) {
        requests.length = latLngList.length - requestCount
      }
    })
    .effect(([lat, lng]) => {
      requests[requestCount % BATCH_NUMBER] = {
        id: `${lat}-${lng}`,
        request: service.makeRequest({
          method: 'get',
          endpoint,
          queryParams: { lat, lng, formatted: 0 }
        })
      }
      requestCount++
    })
    .filter(() => requestCount % BATCH_NUMBER === 0 || requestCount === latLngList.length)
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
        apiResponses.forEach(([pointId, data]) => {
          points.setPointProperty(pointId, {
            key: 'sunriseSunset',
            value: data.results
          })
          if (stats.get('earliestSunrise')) {
            const responseSunrise = moment.utc(getTimeForMoment(data.results.sunrise))
            const { earliestSunrise } = stats.get('earliestSunrise')
            console.log('diff', earliestSunrise.diff(responseSunrise))
            if (earliestSunrise.diff(responseSunrise) > 0) {
              stats.set('earliestSunrise', {
                earliestSunrise: responseSunrise,
                dayLength: data.results.day_length
              })
            }
          } else {
            stats.set('earliestSunrise', {
              earliestSunrise: moment.utc(getTimeForMoment(data.results.sunrise)),
              dayLength: data.results.day_length
            })
          }
        })
      }
    })
    .map(() => {
      return new Promise(resolve => setTimeout(resolve, 0))
    })
    .runAsync(() => console.log('sunriseSunset END', stats.get('earliestSunrise')))
}

function getTimeForMoment(timeString) {
  const [time, ampm] = timeString.split(' ')
  let [h, m, s] = time.split(':')
  if (ampm.toUpperCase() === 'PM') {
    h = +h + 12
  }
  return { hour: h, minute: m, seconds: s }
}
