import fs, { open } from "fs/promises";

export async function checkFile(fileName: string) {
  try {
    try {
      await fs.access("data");
    } catch (err) {
      if (err.code === "ENOENT") {
        try {
          await fs.mkdir("data", { recursive: true });
          console.log(`Directory created: data`);
        } catch (mkdirError) {
          console.error(`Error creating directory: ${mkdirError.message}`);
        }
      }
    }
    let file = await open(`data/${fileName}.json`);
    return readFile(file);
  } catch (err) {
    return {
      err,
      error: "Error Opening File",
    };
  }
}

export async function writeFile(year: string, data: string) {
  try {
    let file = await fs.open(`data/${year}.json`, "w");
    await fs.writeFile(file, data);
    file.close();
  } catch (err) {
    return { err };
  }
}

export async function readFile(file: fs.FileHandle): Promise<string | any> {
  try {
    let data = "";
    for await (let line of file.readLines()) {
      data += line;
    }
    file.close();
    return data;
  } catch (err) {
    return { error: "Error Reading Content", err };
  }
}
