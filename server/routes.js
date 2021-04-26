const express = require('express');
const { getCountries } = require('./controllers/countries');
const {
  getDiphtheria,
  getCholera,
  getPoliomyelitis,
  getMalaria,
  getRubella,
  getMeasles,
  getTuberculosis,
} = require('./controllers/disease');

const router = express.Router();

router.get('/countries', getCountries);
router.get('/disease/malaria', getMalaria);
router.get('/disease/diphtheria', getDiphtheria);
router.get('/disease/cholera', getCholera);
router.get('/disease/poliomyelitis', getPoliomyelitis);
router.get('/disease/rubella', getRubella);
router.get('/disease/measles', getMeasles);
router.get('/disease/tuberculosis', getTuberculosis);

module.exports = router;
