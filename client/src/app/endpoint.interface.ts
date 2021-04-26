export interface Disease {
  NumericValue: number;
  SpatialDimType: string;
  SpatialDim: string;
  TimeDimType: string;
  TimeDim: number;
}

export interface Country {
  Code: string;
  Title: string;
  ParentDimension: string;
  Dimension: string;
  ParentCode: string;
  ParentTitle: string;
}

export interface CountryDictionary {
  [countryCode: string]: Country;
}
