const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createNextId,
  addItem,
  updateItem,
  deleteItem,
  updateHero
} = require("../src/data-utils");

test("createNextId возвращает 1 для пустого массива", () => {
  assert.equal(createNextId([]), 1);
});

test("createNextId возвращает следующий id", () => {
  const items = [
    { id: 1, name: "Первый" },
    { id: 4, name: "Второй" }
  ];

  assert.equal(createNextId(items), 5);
});

test("addItem добавляет элемент с новым id", () => {
  const items = [
    { id: 1, name: "Настя" }
  ];

  const result = addItem(items, {
    name: "Оля"
  });

  assert.equal(result.length, 2);
  assert.equal(result[1].id, 2);
  assert.equal(result[1].name, "Оля");
});

test("updateItem изменяет нужный элемент", () => {
  const items = [
    { id: 1, name: "Настя", position: "Дизайнер" },
    { id: 2, name: "Оля", position: "Аналитик" }
  ];

  const result = updateItem(items, 2, {
    position: "Руководитель аналитики"
  });

  assert.equal(result[1].position, "Руководитель аналитики");
  assert.equal(result[0].position, "Дизайнер");
});

test("updateItem выбрасывает ошибку, если элемента нет", () => {
  const items = [
    { id: 1, name: "Настя" }
  ];

  assert.throws(() => {
    updateItem(items, 5, {
      name: "Новое имя"
    });
  });
});

test("deleteItem удаляет элемент по id", () => {
  const items = [
    { id: 1, name: "Настя" },
    { id: 2, name: "Оля" }
  ];

  const result = deleteItem(items, 1);

  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test("updateHero изменяет данные hero-блока", () => {
  const data = {
    sections: {
      hero: {
        titleHtml: "Старый заголовок",
        titleText: "Старый заголовок",
        video: {
          src: "old.mp4",
          dataSrc: "old.mp4"
        }
      }
    }
  };

  const result = updateHero(data, {
    titleHtml: "Новый<br>заголовок",
    titleText: "Новый заголовок",
    videoSrc: "new.mp4"
  });

  assert.equal(result.sections.hero.titleHtml, "Новый<br>заголовок");
  assert.equal(result.sections.hero.titleText, "Новый заголовок");
  assert.equal(result.sections.hero.video.src, "new.mp4");
  assert.equal(result.sections.hero.video.dataSrc, "new.mp4");
});