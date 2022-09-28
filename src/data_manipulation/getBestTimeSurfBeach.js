const BeachData = require('../domain/BeachData');
const ScoringSystem = require('../domain/ScoringSystem');

/* eslint-disable max-len */
const parseDataFrom = (beachObjs, date) => {
  const parsedBeachs = beachObjs.map((beach) => ({ name: beach.name, data: beach.getBeachData(date) }));
  const scoringSystem = ScoringSystem.fromJSON(parsedBeachs);

  return scoringSystem.bestBeachsByDayHourhand();
};

const getBestTimeSurfBeach = (beachs) => {
  const beachObjs = beachs.map(BeachData.fromJSON);
  return {
    today: parseDataFrom(beachObjs, 'today'),
    tomorrow: parseDataFrom(beachObjs, 'tomorrow'),
  };
};

module.exports = getBestTimeSurfBeach;
