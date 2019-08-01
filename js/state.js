const data = JSON.parse(document.querySelector('#data').innerText);

const state = {
  builtItems: [],
  buildableItems: [],
  possibleItems: [],
  acquiredItems: [],
  items: data.items,
  acquiredChamps: [],
  champs: data.champs
};

const update = () => {
  updateChamps();
  updateItems();
};
