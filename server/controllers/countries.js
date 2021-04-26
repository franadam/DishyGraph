const axios = require('axios').default;

const getCountries = async (req, res) => {
  try {
    const response = await axios.get(
      'https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues'
    );
    const countries = response.data.value;
    res.json(countries);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

module.exports = {
  getCountries,
};
