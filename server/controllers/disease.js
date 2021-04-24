const axios = require('axios').default;
const baseURL = 'https://ghoapi.azureedge.net/api';

const getMalaria = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_48`);
    const WHS3_48 = response.data.value;
    res.json(WHS3_48);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

const getDiphtheria = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_41`);
    const WHS3_41 = response.data.value;
    res.json(WHS3_41);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

const getCholera = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_40`);
    const WHS3_40 = response.data.value;
    res.json(WHS3_40);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

const getPoliomyelitis = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_49`);
    const WHS3_49 = response.data.value;
    res.json(WHS3_49);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

module.exports = {
  getMalaria,
  getDiphtheria,
  getCholera,
  getPoliomyelitis,
};
