import axios from "axios";
import http from "http";
import { URL } from "url";

import { URL_WEB, scraper } from "./src";

async function getMonth(year: string, month: string) {
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

const server = http.createServer((req, res) => {
  if (!req.url) return;
  const parsedUrl = new URL(req.url, "http://localhost");
  if (parsedUrl.pathname === "/") {
    const year = parsedUrl.searchParams.get("year") as string;
    const month = parsedUrl.searchParams.get("month") as string;

    console.log(
      req.method +
        "\t" +
        parsedUrl.pathname +
        "\t" +
        "Year: " +
        year +
        "\t" +
        "Month: " +
        month
    );

    getMonth(year, month)
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      })
      .catch((e) => {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end();
      });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
