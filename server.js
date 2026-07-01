const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const { readJson, writeJson } = require("./src/data-storage");

const app = express();
const PORT = 3000;

const dataPath = path.join(__dirname, "data", "data.json");
const rootIndexPath = path.join(__dirname, "index.html");
const publicIndexPath = path.join(__dirname, "public", "index.html");

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    await fs.access(publicIndexPath);
    res.sendFile(publicIndexPath);
  } catch (error) {
    res.sendFile(rootIndexPath);
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const data = await readJson(dataPath);
    res.json(data);
  } catch (error) {
    console.error("Ошибка чтения data.json:", error);
    res.status(500).json({
      success: false,
      message: "Не удалось прочитать данные сайта"
    });
  }
});

app.post("/api/data", async (req, res) => {
  try {
    await writeJson(dataPath, req.body);

    res.json({
      success: true,
      message: "Данные успешно сохранены"
    });
  } catch (error) {
    console.error("Ошибка сохранения data.json:", error);
    res.status(500).json({
      success: false,
      message: "Не удалось сохранить данные сайта"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});