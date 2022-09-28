const getBestTimeSurfBeach = require('../data_manipulation/getBestTimeSurfBeach');
const generateBeachReport = require('./specificBeachScrap');

const beachs = [
  { name: 'Chapa', url: 'https://magicseaweed.com/Las-Cuevas-La-Popular-Surf-Report/1159/' },
  { name: 'Serena', url: 'https://magicseaweed.com/Serena-Surf-Report/1287/' },
  { name: 'Cardiel', url: 'https://magicseaweed.com/La-Pepita-Surf-Report/2707/' },
];
const main = () => Promise.all(
  beachs.map(async (beach) => {
    const data = await generateBeachReport(beach);
    return { name: beach.name, data };
  }),
)
  .then((beachsResponse) => {
    const response = getBestTimeSurfBeach(beachsResponse);
    console.log(JSON.stringify(response));
  });

main();
