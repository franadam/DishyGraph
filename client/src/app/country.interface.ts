interface Country {
  Code: string;
  Title: string;
  ParentDimension: string;
  Dimension: string;
  ParentCode: string;
  ParentTitle: string;
}

export interface CountryDictionary {
  [countryCode:string] : Country
}

export default Country;
