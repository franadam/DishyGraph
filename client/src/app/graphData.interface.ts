interface Hierarchy {
  name: string;
  code: string;
  parentName : string;
  parentCode : string;
  value: number; 
}

interface Pie {
  name: string;
  code: string;
  value: number;
}

interface Force {
  nodes: [];
  links: [];
}

export { Hierarchy, Pie, Force };
