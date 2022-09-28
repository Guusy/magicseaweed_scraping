/**
 * @name get text value of an element
 *
 * @desc Gets the text value of an element by using the page.$eval method
 *
 */
const puppeteer = require('puppeteer');

// TODO: get tides
const generateBeachReport = async (beach) => {
  console.log(`Generando reporte de la playa ${beach.name}...`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
    deviceScaleFactor: 1,
  });
  page.setDefaultNavigationTimeout(9000000);
  await page.goto(beach.url);
  const data = await page.evaluate(() => {
    const getDataOfDayMoment = (dayMoment, name) => {
      try {
        const meters = dayMoment.querySelector(
          '.table-forecast-breaking-wave > span',
        ).textContent;
        const activeStars = dayMoment.querySelectorAll('.active').length;
        const inactiveStars = dayMoment.querySelectorAll('.inactive').length;
        const [, , , averageMetersElement, periodElement] = dayMoment.querySelectorAll('td');
        const [, swellDirectionElement] = dayMoment.querySelectorAll('.msw-js-tooltip');
        const [minWindElement, maxWindElement] = dayMoment.querySelectorAll(
          '.table-forecast-wind > .stacked-text',
        );
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

        const swellDirection = swellDirectionElement.getAttribute(
          'data-original-title',
        );
        return {
          id: name,
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
    const buildResponse = (container) => {
      const [, , , dawn, midMorning, noon, afternoon, sunset] = container.querySelectorAll('tr');
      return [
        getDataOfDayMoment(dawn, 'dawn'),
        getDataOfDayMoment(midMorning, 'midMorning'),
        getDataOfDayMoment(noon, 'noon'),
        getDataOfDayMoment(afternoon, 'afternoon'),
        getDataOfDayMoment(sunset, 'sunset'),
      ];
    };
    const [todayForecast, tomorrowForecast] = document.querySelectorAll(
      '.table-forecast > tbody',
    );
    return {
      today: buildResponse(todayForecast),
      tomorrow: buildResponse(tomorrowForecast),
    };
  });

  await browser.close();
  return data;
};

module.exports = generateBeachReport;
