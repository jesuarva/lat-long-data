export function createListOfGeoCoordinates(numberOfPoints) {
  const points = Array(numberOfPoints)
  for (let i = 0; i < numberOfPoints; i++) {
    points[i] = [
      Math.random() * (90 - -90) + -90,
      Math.random() * (180 - -180) + -180
    ]
  }
  return points
}
