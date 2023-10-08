import axios from "axios";

import { error } from "console";
import { URL_WEB, checkFile, scraper, writeFile } from "..";

async function getDataFromFile(year: string) {
  let data = await checkFile(year);
  if (!data.err) {
    return { sucess: true, data };
  }
  return { sucess: false };
}

async function getDataFromWeb(year, month) {
  try {
    let { data } = await axios.post(
      URL_WEB,
      `selYear=${year}&selMonth=${month}&viewCalander=View+Calander`,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return scraper(data);
  } catch (error) {
    return error;
  }
}

export async function getMonth(year: string, month: string) {
  if (!year || !month) return getDataFromWeb(year, month);
  let data = await getDataFromFile(year);
  if (data.sucess) {
    if (data.data !== "") {
      let parsedData = JSON.parse(data.data);
      for (let i of Object.keys(parsedData)) {
        if (month === i) {
          return parsedData[i];
        }
      }

      let dataFromWeb = await getDataFromWeb(year, month);
      if (dataFromWeb.error) {
        return dataFromWeb.error;
      }
      parsedData[month] = dataFromWeb;
      writeFile(year, JSON.stringify(parsedData));
      return dataFromWeb;
    } else {
      let dataFromWeb = await getDataFromWeb(year, month);
      if (dataFromWeb.error) {
        return dataFromWeb.error;
      }
      let parsedData = { [month]: dataFromWeb };
      writeFile(year, JSON.stringify(parsedData));
      return dataFromWeb;
    }
  } else if (data.sucess === false) {
    let dataFromWeb = await getDataFromWeb(year, month);
    if (dataFromWeb.error) {
      return dataFromWeb.error;
    }
    writeFile(year, JSON.stringify({ [month]: dataFromWeb }));
    return dataFromWeb;
  } else {
    return {
      code: 500,
      cause: "Internal Server Error",
    };
  }
}
