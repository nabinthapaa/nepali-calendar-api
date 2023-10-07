import { JSDOM } from "jsdom";
import { E_DAYS, N_DAYS, getNumber, metadata, monthData } from "..";

export default function scraper(data: any) {
  let monthData: monthData[] = [];
  let currentDay = 0;
  const dom = new JSDOM(data);
  let nepali = dom.window.document.getElementById("yren")?.textContent?.trim();
  let english = dom.window.document
    .getElementById("entarikYr")
    ?.textContent?.trim();
  const metadata: metadata = {
    nep: {
      month: nepali?.split(" ")[0],
      year: getNumber(nepali?.split(" ")[1]),
    },
    eng: {
      month: {
        firstHalf: english?.split(" ")[0].split("/")[0],
        secondHalf: english?.split(" ")[0].split("/")[1],
      },
      year: {
        firstHalf: Number(english?.split(" ")[1].split("/")[0]),
        secondHalf: Number(english?.split(" ")[1].split("/")[1]),
      },
    },
  };
  let currentHalf = metadata.eng.month.firstHalf;
  let currentYear = metadata.eng.year.firstHalf;
  let prevDate = Number(dom.window.document.getElementById("eday")) - 1;
  dom.window.document.querySelectorAll(".cells")?.forEach((element) => {
    const date = element.querySelector("#nday")?.textContent?.trim();
    const e_date = element.querySelector("#eday")?.textContent?.trim();
    const tithi = element.querySelector("#dashi")?.textContent?.trim();
    const fest = element.querySelector("#fest")?.textContent?.trim();
    const isHoliday =
      element
        .querySelector("#nday font")
        ?.getAttribute("color")
        ?.trim()
        .toLowerCase() === "red";
    if (currentHalf === metadata.eng.month.firstHalf) {
      if (prevDate > Number(e_date)) {
        currentHalf = metadata.eng.month.secondHalf;
        if (Number(currentYear) < Number(metadata.eng.year.secondHalf)) {
          currentYear = metadata.eng.year.secondHalf;
        }
      }
    }
    monthData.push({
      nep: {
        date: getNumber(date),
        tithi,
        fest,
        day: N_DAYS[currentDay],
      },
      eng: {
        date: Number(e_date),
        day: E_DAYS[currentDay],
        month: currentHalf,
        year: Number(currentYear),
      },
      isHoliday,
      currentDay,
    });
    currentDay++;
    if (currentDay > 6) currentDay = 0;

    prevDate = Number(e_date);
  });
  return {
    metadata,
    days: monthData.filter((e) => e.nep.date !== 0),
  };
}
