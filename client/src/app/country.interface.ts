export interface Country {
  name: string;
  code: string;
  regionName: string;
  regionCode: string;
  value: number;
}

interface CountryDictionary {
  [countryCode: string]: Country;
}

export default CountryDictionary;
