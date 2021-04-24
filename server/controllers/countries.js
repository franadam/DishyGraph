const axios = require('axios').default;

const getCountries = async (req, res) => {
  try {
    const response = await axios.get(
      'https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues'
    );
    const dico = {};
    const countries = response.data.value;
    countries.forEach((c) => {
      dico[c.Code] = c;
    });
    res.json(dico);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

module.exports = {
  getCountries,
};
