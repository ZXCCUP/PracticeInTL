const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const fs = require("fs/promises");
const { readJson, writeJson } = require("../src/data-storage");

test("writeJson записывает данные в файл, а readJson читает их обратно", async () => {
  const filePath = path.join(__dirname, "temp-data.json");

  const data = {
    sections: {
      hero: {
        titleText: "Тестовый заголовок"
      }
    }
  };

  await writeJson(filePath, data);
  const result = await readJson(filePath);

  assert.equal(result.sections.hero.titleText, "Тестовый заголовок");

  await fs.unlink(filePath);
});