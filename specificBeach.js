/**
 * @name get text value of an element
 *
 * @desc Gets the text value of an element by using the page.$eval method
 *
 */
const puppeteer = require('puppeteer');

(async () => {
  console.log('Generando reporte de la mejor playa para surfear MAÑANA...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
    deviceScaleFactor: 1,
  });

  // const playasData = playas.map( async(playa) => {})
  await page.goto('https://magicseaweed.com/Biologia-Surf-Report/2704/');
  const data = await page.evaluate(() => {
    const getDataOfDayMoment = (dayMoment) => {
      try {
        const meters = dayMoment.querySelector('.table-forecast-breaking-wave > span').textContent;
        const activeStars = dayMoment.querySelectorAll('.active').length;
        const inactiveStars = dayMoment.querySelectorAll('.inactive').length;
        const [, , , averageMetersElement, periodElement] = dayMoment.querySelectorAll('td');
        const [, swellDirectionElement] = dayMoment.querySelectorAll('.msw-js-tooltip');
        const [minWindElement, maxWindElement] = dayMoment.querySelectorAll('.table-forecast-wind > .stacked-text');
        const windDirectionElement = dayMoment.querySelector('.last');
        const averageMeters = averageMetersElement.querySelector('h4').textContent;
        const period = periodElement.querySelector('h4').textContent;

        // TODO: get tide

        let status;
        if (dayMoment.querySelector('.background-success')) {
          status = 'success';
        }
        if (dayMoment.querySelector('.background-warning')) {
          status = 'warning';
        }
        if (dayMoment.querySelector('.background-danger')) {
          status = 'danger';
        }

        const swellDirection = swellDirectionElement.getAttribute('data-original-title');
        return {
          status,
          meters,
          activeStars,
          inactiveStars,
          averageMeters,
          period,
          swellDirection,
          wind: {
            direction: windDirectionElement.getAttribute('data-original-title'),
            min: minWindElement.textContent,
            max: maxWindElement.textContent,

          },
        };
      } catch (error) {
        console.log('el error', error);
        throw error;
      }
    };
    const [, containerForeCast] = document.querySelectorAll('.table-forecast > tbody');
    const [, , , dawn, midMorning, noon, afternoon, sunset] = containerForeCast.querySelectorAll('tr');
    return {
      dawn: getDataOfDayMoment(dawn),
      midMorning: getDataOfDayMoment(midMorning),
      noon: getDataOfDayMoment(noon),
      afternoon: getDataOfDayMoment(afternoon),
      sunset: getDataOfDayMoment(sunset),
    };
  });

  console.log(JSON.stringify(data));
  await browser.close();
})();
