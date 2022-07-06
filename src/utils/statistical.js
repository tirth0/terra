const axios = require('axios');
const ndvi = require('./statistic.evalscript');

const requestStatistical = async ({
  requestsConfig,
  geometry,
  requestUrl = 'https://services.sentinel-hub.com/api/v1/statistics',
}) => {
  try {
    const data = {
      input: {
        bounds: {
          geometry,
        },
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
          to: '2022-07-07T00:00:00Z'
        },
        aggregationInterval: {
          of: 'P10D'
        },
        evalscript: ndvi,
        resx: 10,
        resy: 10
      }
    };
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${requestsConfig.authToken}`
    };
    const response = await axios.post(requestUrl, data, { headers });
    return [response.data, null];
  } catch (err) {
    console.log(err?.response?.data);
    return [null, err];
  }
};

module.exports = requestStatistical;
