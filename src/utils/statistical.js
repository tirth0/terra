const axios = require('axios');
const ndvi = require('./statistic.evalscript');

const requestStatistical = async ({
  requestConfig,
  geometry,
  requestUrl = 'https://services.sentinel-hub.com/api/v1/statistics',
}) => {
  try {
    const data = {
      input: {
        bounds: {
          geometry,
          data: [
            {
              type: 'sentinel-2-l2a',
              dataFilter: {
                mosaickingOrder: 'leastCC'
              }
            }
          ]
        },
        aggregation: {
          timeRange: {
            from: '2021-01-01T00:00:00Z',
            to: '2022-06-31T00:00:00Z'
          },
          aggregationInterval: {
            of: 'P30D'
          },
          evalscript: ndvi,
          resx: 10,
          resy: 10
        }
      }
    };
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${requestConfig.authToken}`
    };
    const response = await axios.post(requestUrl, data, header);
    return [response.data, null];
  } catch (err) {
    console.log(err);
    return [null, err];
  }
};

module.exports = requestStatistical;
