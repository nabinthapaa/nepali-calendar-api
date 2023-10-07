const MAP = {
  "०": 0,
  "१": 1,
  "२": 2,
  "३": 3,
  "४": 4,
  "५": 5,
  "६": 6,
  "७": 7,
  "८": 8,
  "९": 9,
};

export default function getNumber(number) {
  let s = "";
  for (let i in number) {
    s += MAP[number[i]];
  }
  return Number(s);
}
