/* eslint-disable max-len */
const data = [
  {
    id: 'dawn',
    status: 'success',
    meters: '1ft',
    activeStars: 0,
    inactiveStars: 0,
    averageMeters: '  0.9ft  ',
    period: '  10s  ',
    swellDirection: 'ESE - 123°',
    wind: {
      direction: 'Gentle, Offshore WNW - 284°',
      min: ' 7 ',
      max: '    11  mph ',
    },
  },
  {
    id: 'midMorning',

    status: 'success',
    meters: '1ft',
    activeStars: 0,
    inactiveStars: 0,
    averageMeters: '  0.8ft  ',
    period: '  10s  ',
    swellDirection: 'SE - 124°',
    wind: {
      direction: 'Gentle, Offshore WSW - 245°',
      min: ' 9 ',
      max: '    12  mph ',
    },
  },
  {
    id: 'noon',
    status: 'success',
    meters: '1ft',
    activeStars: 1,
    inactiveStars: 0,
    averageMeters: '  2ft  ',
    period: '  10s  ',
    swellDirection: 'SE - 125°',
    wind: {
      direction: 'Gentle, Offshore SSW - 213°',
      min: ' 8 ',
      max: '    13  mph ',
    },
  },
  {
    id: 'afternoon',
    status: 'success',
    meters: '1-2ft',
    activeStars: 1,
    inactiveStars: 0,
    averageMeters: '  2ft  ',
    period: '  13s  ',
    swellDirection: 'S - 172°',
    wind: {
      direction: 'Fresh, Cross/Offshore S - 190°',
      min: ' 17 ',
      max: '    19  mph ',
    },
  },
  {
    id: 'sunset',
    status: 'warning',
    meters: '1-2ft',
    activeStars: 0,
    inactiveStars: 1,
    averageMeters: '  3ft  ',
    period: '  12s  ',
    swellDirection: 'S - 172°',
    wind: {
      direction: 'Fresh, Cross/Offshore S - 190°',
      min: ' 14 ',
      max: '    20  mph ',
    },
  },
];
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
const processData = () => {
  const units = data[0].meters.includes('ft') ? 'ft' : 'm';

  // normalize data
  const normalizedData = data
    .filter(({ status }) => status === 'success')
    .map((momentOfDay) => {
      const newMomentOfDay = { ...momentOfDay };
      const avgMeterCalculation = metersCastToNumber(newMomentOfDay.averageMeters, units);
      newMomentOfDay.wind = {
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

  const maxStarts = normalizedData.reduce((prev, current) => ((prev.activeStars > current.activeStars) ? prev : current));

  const filteredData = normalizedData
    .filter(({ activeStars, averageMeters }) => {
      const hasStars = activeStars === maxStarts.activeStars || activeStars === maxStarts.activeStars - 1;
      const hasGoodMeters = averageMeters >= 0.6;
      return hasStars && hasGoodMeters;
    });

  return filteredData.reduce((prev, current) => ((prev.wind.min < current.wind.min && prev.wind.max < current.wind.max) ? prev : current));
};

const pepe = processData();

