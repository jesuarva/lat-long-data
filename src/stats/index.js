export default Stats()

function Stats() {
  const stats = {}
  return {
    set(stat, value) {
      stats[stat] = value
    },
    get(stat) {
      return stats[stat]
    }
  }
}
