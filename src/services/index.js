import { ServiceManager } from './ServiceManager'

export const SERVICES = [
  { uri: 'https://api.sunrise-sunset.org', endpoint: 'json', headers: {} }
]

export function InitServices(listOfServices) {
  return listOfServices.map(({ uri, headers }) => {
    return ServiceManager().init(uri, headers)
  })
}
