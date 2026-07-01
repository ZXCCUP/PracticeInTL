const fs = require("fs/promises");

async function readJson(filePath) {
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

module.exports = {
  readJson,
  writeJson
};