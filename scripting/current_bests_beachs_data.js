const puppeteer = require('puppeteer');

(async () => {
  console.log('Generando reporte de la mejor playa para surfear...');

  const _roundOneDecimal = (value) => Math.round(value * 10) / 10;

  const normalizeData = ({ playas, units }) => playas.map((playa) => {
    const [fromString, to_String] = playa.meters.split('-');
    let from = Number.parseFloat(fromString);
    let to = to_String ? Number.parseFloat(to_String.replace(units, '')) : 0;

    if (units !== 'm') {
      from /= 3.2;
      to /= 3.2;
    }

    return { ...playa, from: _roundOneDecimal(from), to: _roundOneDecimal(to) };
  });

  const printBeach = (beach) => `${beach.name}, ${beach.stars} estrellas, con un oleaje entre ${beach.from} y ${beach.to} metros`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
    deviceScaleFactor: 1,
  });
  await page.goto('https://magicseaweed.com/Mar-del-Plata-Surfing/151/');
  const data = await page.evaluate(() => {
    const items = document.querySelectorAll('.msw-js-spot-list > div > ul > li > a');
    let units;
    const playas = [];
    for (const item of items) {
      const metersRaw = item.querySelector('.rating-text-block').textContent;
      if (!units) {
        const unitElement = item.querySelectorAll('.unit');
        units = unitElement[0].textContent;
      }
      const playa = {
        name: item.querySelector('h5').innerHTML,
        meters: metersRaw.replace(/\t/g, '').replace(/\n/g, ''),
        stars: item.querySelectorAll('.active').length,
        futureStars: item.querySelectorAll('.inactive').length,
      };
      playas.push(playa);
    }

    return { playas, units };
  });

  const playas = normalizeData(data)
    .filter(({ name }) => name !== 'South Georgia')
    .sort((playa_a, playa_b) => {
      const differenceStars = playa_b.stars - playa_a.stars;
      if (differenceStars !== 0) {
        return differenceStars;
      }
      return playa_b.to - playa_a.to;
    });

  console.log(`La mejor playa es ${printBeach(playas[0])}`);
  console.log('----------------------');
  console.log(`2da ${printBeach(playas[1])}`);
  console.log(`3era ${printBeach(playas[2])}`);
  console.log(`4ta ${printBeach(playas[3])}`);
  console.log(`5ta ${printBeach(playas[4])}`);

  await browser.close();
})();

// const data = {
//     playas: [
//       {
//         name: 'Varese', meters: '3-5ft', stars: 2, futureStars: 1,
//       },
//     ],
//     units: 'm',
//   };
