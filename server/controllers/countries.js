const axios = require('axios').default;

const getCountries = async (req, res) => {
  try {
    const [ghoapi, restcountries] = await Promise.all([
      axios.get(
        'https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues'
      ),
      axios.get('https://restcountries.eu/rest/v2/'),
    ]);

    const countries = ghoapi.data.value.map(
      ({ Code, Title, ParentCode, ParentTitle }) => ({
        name: Title,
        code: Code,
        regionName: ParentTitle,
        regionCode: ParentCode,
        value: 0,
      })
    );

    const countryDictionary = {};
    countries.forEach((c) => {
      countryDictionary[c.code] = c;
    });

    restcountries.data.forEach((c) => {
      if (countryDictionary[c.alpha3Code]) {
        countryDictionary[c.alpha3Code] = {
          ...countryDictionary[c.alpha3Code],
          ...c,
        };
      }
    });
    res.json(countryDictionary);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

module.exports = {
  getCountries,
};
