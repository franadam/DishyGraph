interface Hierarchy {
  countryName: string;
  countryCode: string;
  regionName: string;
  regionCode: string;
  value: number;
  disease: string;
}

interface Pie {
  name: string;
  code?: string;
  value: number;
}

interface Bar {
  [disease: string]: number;
  year: number;
}

interface BarArr {
  prototype?:any
}
//BarArray.prototype.columns = []

interface Force {
  nodes: [];
  links: [];
}

export { Hierarchy, Pie, Force, Bar, BarArr };
