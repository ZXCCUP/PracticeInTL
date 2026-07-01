function createNextId(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return 1;
  }

  return Math.max(...items.map(item => Number(item.id) || 0)) + 1;
}

function addItem(items, item) {
  if (!Array.isArray(items)) {
    throw new Error("Список должен быть массивом");
  }

  if (!item || typeof item !== "object") {
    throw new Error("Новый элемент должен быть объектом");
  }

  return [
    ...items,
    {
      ...item,
      id: createNextId(items)
    }
  ];
}

function updateItem(items, id, changes) {
  if (!Array.isArray(items)) {
    throw new Error("Список должен быть массивом");
  }

  let found = false;

  const updatedItems = items.map(item => {
    if (Number(item.id) === Number(id)) {
      found = true;

      return {
        ...item,
        ...changes,
        id: item.id
      };
    }

    return item;
  });

  if (!found) {
    throw new Error("Элемент не найден");
  }

  return updatedItems;
}

function deleteItem(items, id) {
  if (!Array.isArray(items)) {
    throw new Error("Список должен быть массивом");
  }

  return items.filter(item => Number(item.id) !== Number(id));
}

function updateHero(data, values) {
  const nextData = JSON.parse(JSON.stringify(data));

  if (!nextData.sections || !nextData.sections.hero) {
    throw new Error("Hero-блок не найден");
  }

  nextData.sections.hero.titleHtml = values.titleHtml;
  nextData.sections.hero.titleText = values.titleText;

  if (values.videoSrc) {
    nextData.sections.hero.video.src = values.videoSrc;
    nextData.sections.hero.video.dataSrc = values.videoSrc;
  }

  return nextData;
}

module.exports = {
  createNextId,
  addItem,
  updateItem,
  deleteItem,
  updateHero
};