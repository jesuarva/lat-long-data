export const points = Points()

function Points() {
  let points = null
  return {
    length: 0,
    init(listOfPoints) {
      if (points) return
      points = listOfPoints.reduce((allPoints, [lat, long]) => {
        const point = new Point({ lat, long })
        allPoints[point.id] = point
        return allPoints
      }, {})
      this.length = listOfPoints.length
    },
    getPoint(pointId) {
      return points[pointId]
    },
    setPointProperty(pointId, { key, value }) {
      points[pointId].setProperty(key, value)
    },
    getPointProperty(pointId, key) {
      return points[pointId]
    },
    deletePointProperty(pointId, key) {
      points[pointId].delete(key)
    }
  }
}

class Point {
  constructor({ lat, long }) {
    this.id = `${lat}-${long}`
    this.lat = lat
    this.long = long
    this.properties = {}
  }
  getProperty(key) {
    return this.properties[key]
  }
  setProperty(key, value) {
    this.properties[key] = value
  }
  delete(key) {
    delete this.properties[key]
  }
}
