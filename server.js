const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = 3000;

const dataPath = path.join(__dirname, 'data', 'data.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/data', async (req, res) => {
  try {
    const file = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(file);

    res.json(data);
  } catch (error) {
    console.error('Ошибка чтения data.json:', error);

    res.status(500).json({
      message: 'Не удалось прочитать данные сайта'
    });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;

    await fs.writeFile(
      dataPath,
      JSON.stringify(newData, null, 2),
      'utf-8'
    );

    res.json({
      success: true,
      message: 'Данные успешно сохранены'
    });
  } catch (error) {
    console.error('Ошибка сохранения data.json:', error);

    res.status(500).json({
      success: false,
      message: 'Не удалось сохранить данные сайта'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});