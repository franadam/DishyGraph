const axios = require('axios').default;
const baseURL = 'https://ghoapi.azureedge.net/api';

const getCholera = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_40`);
    const WHS3_40 = response.data.value;
    res.status(200).json(WHS3_40);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

const getDiphtheria = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_41`);
    const WHS3_41 = response.data.value;
    res.status(200).json(WHS3_41);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

const getMalaria = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_48`);
    const WHS3_48 = response.data.value;
    res.status(200).json(WHS3_48);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

const getPoliomyelitis = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_49`);
    const WHS3_49 = response.data.value;
    res.status(200).json(WHS3_49);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

const getTuberculosis = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_54`);
    const WHS3_54 = response.data.value;
    res.status(200).json(WHS3_54);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

const getRubella = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_57`);
    const WHS3_57 = response.data.value;
    res.status(200).json(WHS3_57);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

const getMeasles = async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/WHS3_62`);
    const WHS3_62 = response.data.value;
    res.status(200).json(WHS3_62);
  } catch (error) {
    console.log('error :>> ', error);
  }
};

module.exports = {
  getMalaria,
  getDiphtheria,
  getCholera,
  getPoliomyelitis,
  getRubella,
  getTuberculosis,
  getMeasles,
};
