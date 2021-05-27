interface Disease {
  name: string;
  value: number;
  placeDim: string;
  place: string;
  timeDim: string;
  time: number;
}

export type DiseaseArray = Disease[];

export default Disease;
