import ServiceManager from './ServiceManager'

export default ServiceManager

export const SERVICES = {
  sunriseSunset: {
    uri: 'https://api.sunrise-sunset.org',
    endpoint: 'json',
    headers: {}
  }
}
