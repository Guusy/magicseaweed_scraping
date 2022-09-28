const roundOneDecimal = (value) => Math.round(value * 10) / 10;

const metersCastToNumber = (metersString, units) => {
  const [minMeter, maxMeter] = metersString.split('-');
  let from = Number.parseFloat(minMeter);
  let to = maxMeter ? Number.parseFloat(maxMeter.replace(units, '')) : 0;

  if (units !== 'm') {
    from /= 3.2;
    to /= 3.2;
  }
  return {
    from: roundOneDecimal(from),
    to: roundOneDecimal(to),
  };
};
class BeachData {
  getUnits() {
    return this.data.today[0].meters.includes('ft') ? 'ft' : 'm';
  }

  // getSuccessTimes(date) {
  //   return this.data[date].filter(({ status }) => status === 'success');
  // }

  getBeachData(date) {
    const normalizedData = this.data[date]
      .map((momentOfDay) => {
        const units = momentOfDay.meters.includes('ft') ? 'ft' : 'm';
        const newMomentOfDay = { ...momentOfDay };
        const avgMeterCalculation = metersCastToNumber(newMomentOfDay.averageMeters, units);
        const [, windString] = newMomentOfDay.wind.direction.split(',');
        const [, windType] = windString.split(' ');
        newMomentOfDay.wind = {
          direction: windType,
          min: Number.parseInt(newMomentOfDay.wind.min, 10),
          max: Number.parseInt(newMomentOfDay.wind.max.replace('mph', '').replace('kph', ''), 10),
        };

        newMomentOfDay.period = Number.parseInt(newMomentOfDay.period.split('s')[0], 10);
        newMomentOfDay.meters = metersCastToNumber(newMomentOfDay.meters, units);
        newMomentOfDay.averageMeters = avgMeterCalculation.from;
        return {
          ...newMomentOfDay,
        };
      });
    return normalizedData;
  }

  static fromJSON(json) {
    return Object.assign(new BeachData(), json);
  }
}

module.exports = BeachData;
