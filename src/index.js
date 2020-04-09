import { sunriseSunsetController } from './controllers/sunriseSunsetController'
import { points } from './data'
import stats from './stats'
import { createListOfGeoCoordinates } from './utils'

const BATCH_NUMBER = 5
const LIST_OF_GEO_COORDINATES = createListOfGeoCoordinates(100)
points.init(LIST_OF_GEO_COORDINATES)

sunriseSunsetController({
  points,
  stats,
  latLngList: LIST_OF_GEO_COORDINATES,
  BATCH_NUMBER
})
