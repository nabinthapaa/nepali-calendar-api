import http from "http";
import { URL } from "url";
import { getMonth } from "./src";

const MAX = 2081;

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
    if (!!year || !!month)
      if (
        Number(year) < 1992 ||
        Number(year) > MAX ||
        Number(month) < 1 ||
        Number(month) > 12
      ) {
        res.writeHead(404, { "Content-Type": "application/json" });
        const data = {
          error: 404,
          message: "Data not found. Please check the year and date entered",
        };
        res.end(JSON.stringify(data));
      }

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

server.listen(42069, () => {
  console.log(`Server is running at http://localhost:${42069}`);
});
