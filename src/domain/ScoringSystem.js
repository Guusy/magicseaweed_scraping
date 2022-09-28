const points = {
  Offshore: 3,
  'Cross/Offshore': 2,
  'Cross-shore': 1,
  'Cross/Onshore': -2,
  Onshore: -3,
};

class ScoringSystem {
  // TODO: ADD TESTS !!!!
  bestBeachsByDayHourhand() {
    const scores = this.data.flatMap((beach) => this.calculateScore(beach));
    console.log({ scores });
    const result = this.calculateFinalScores(scores);

    return result
  }

  calculateFinalScores(scores) {
    return scores.reduce((prev, actual) => {
      const prevHourHand = prev[actual.id];

      if (!prevHourHand) {
        return { ...prev, [actual.id]: [{ ...actual }] };
      }

      if (prevHourHand.find((phh) => phh.score === actual.score)) {
        return { ...prev, [actual.id]: [...prev[actual.id], { ...actual }] };
      }
      const lessValueIndex = prevHourHand.findIndex((phh) => phh.score < actual.score);
      if (lessValueIndex === -1) {
        return prev;
      }
      // remove item from array
      prev[actual.id].splice(lessValueIndex, 1);
      return { ...prev, [actual.id]: [...prev[actual.id], { ...actual }] };
    }, { });
  }

  calculateScore(beach) {
    // TODO: Add meters in the scoring system
    return beach.data.map((daytime) => {
      const windPower = this.calculateWindPowerScore(daytime.wind);
      const windDirectionScore = points[daytime.wind.direction] || 0;
      const score = daytime.averageMeters + daytime.period + windDirectionScore + windPower;
      return { beach: beach.name, id: daytime.id, score };
    });
  }

  calculateWindPowerScore(wind) {
    if (wind.max <= 10) {
      return 2;
    }

    if (wind.max <= 18) {
      return 1;
    }

    return -1;
  }

  static fromJSON(json) {
    return Object.assign(new ScoringSystem(), { data: json });
  }
}

module.exports = ScoringSystem;
