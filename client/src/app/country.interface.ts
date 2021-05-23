export interface Country {
  name: string;
  code: string;
  regionName: string;
  regionCode: string;
  value: number;
  population: number;
  capital: string;
  flag: string;
}

interface CountryDictionary {
  [countryCode: string]: Country;
}

export default CountryDictionary;
