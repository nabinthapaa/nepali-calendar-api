interface keyValue {
  [key: string]: number | string | undefined;
}

export interface monthData {
  nep: keyValue;
  eng: keyValue;
  isHoliday: boolean;
  currentDay: number;
}

export interface metadata {
  nep: keyValue;
  eng: {
    month: keyValue;
    year: {
      [key: string]: number;
    };
  };
}
