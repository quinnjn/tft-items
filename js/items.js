const createItemImage = item => {
  return createImage({
    className: 'item',
    name: item,
    src: `item/${item}`
  });
}

const loadItems = (container, items, cb) => {
  for (item of items) {
    loadItem(container, item, cb);
  }
};

const loadItem = (container, item, callback) => {
  const img = createItemImage(item);
  img.addEventListener('click', () => {
    const el = event.target || event.srcElement;

    callback(el.name);

    return false;
  });

  container.appendChild(img);
};

const loadBuiltItems = () => {
  const container = document.querySelector('#built-items');

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  for (builtItem of state.builtItems) {
    const img = createItemImage(builtItem.img);

    img.addEventListener('click', () => {
      const el = event.target || event.srcElement;
      const item = state.builtItems.find(i => i.img === el.name)
      const components = item.components.map(c => c.name)

      components.forEach(c => state.acquiredItems.push(c));
      state.builtItems = state.builtItems.filter(i => i.img !== el.name);

      update();

      return false;
    });

    container.appendChild(img);
  }
}

const loadAcquiredItems = () => {
  const container = document.querySelector('#acquired-items');

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  loadItems(container, state.acquiredItems, (name) => {
    onItemClick(name, false);
  });
}

const determineBuildableItems = () => {
  state.buildableItems = [];

  for (buildableItem of data.buildableItems) {
    const intersectResult = intersect(state.acquiredItems, buildableItem.components);

    if (intersectResult.length == 0) {
      continue;
    }

    const item = JSON.parse(JSON.stringify(buildableItem));
    const hasAllItems = intersectResult.length === 2;
    var has = true;

    item.components = item.components.map(c => {
      var has;
      if (intersectResult.includes(c)) {
        intersectResult.remove(c);
        has = true;
      } else {
        has = false;
      }
      return {
        name: c,
        has
      }
    });

    if (hasAllItems) {
      state.buildableItems.unshift(item);
    } else {
      state.buildableItems.push(item);
    }
  }
};

const loadBuildableItems = () => {
  const container = document.querySelector('#buildable-items');

  determineBuildableItems();

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  for (buildableItem of state.buildableItems) {
    console.log(buildableItem);
    const div = document.createElement('div');
    div.className  = 'row-wrapper';
    const componentContainer = document.createElement('div');
    componentContainer.className  = 'column-wrapper';
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'column-wrapper';
    const bestChampsContainer = document.createElement('div');
    bestChampsContainer.className = 'column-wrapper';

    const img = createItemImage(buildableItem.img);
    if (buildableItem.components.map(i => i.has).every(has => has)) {
      img.addEventListener('click', () => {
        const el = event.target || event.srcElement;
        const item = state.buildableItems.filter(i => i.img === el.name)[0]
        state.acquiredItems.remove(item.components[0].name);
        state.acquiredItems.remove(item.components[1].name);
        state.builtItems.push(item);

        update();
      });
    }

    for (component of buildableItem.components) {
      const componentImg = createItemImage(component.name);

      if (component.has) {
        componentImg.className = 'component'
      } else {
        componentImg.className = 'component-missing'
      }

      componentContainer.appendChild(componentImg);
    }

    const title = document.createElement('p');

    title.innerText = buildableItem.name + "\n" +buildableItem.description;

    detailsContainer.appendChild(title);

    const bestChamps = buildableItem.champs.filter(champ => 
      state.acquiredChamps.includes(champ)
    ).forEach(bestChamp => {
      const bestChampEl = createChampImage(bestChamp, () => {});

      bestChampsContainer.appendChild(bestChampEl);
    });

    div.appendChild(img);
    div.appendChild(componentContainer);
    div.appendChild(detailsContainer);
    div.appendChild(bestChampsContainer);

    if (bestChampsContainer.children.length > 0 && container.firstChild) {
      container.insertBefore(div, container.firstChild);
    } else {
      container.appendChild(div);
    }
  }
};

const updateItems = () => {
  loadBuiltItems();
  loadAcquiredItems();
  loadBuildableItems();
};

const onItemClick = (item, add) => {
  if (add) {
    state.acquiredItems.push(item);
  } else {
    state.acquiredItems.remove(item);
  }

  update();
};

loadItems(document.querySelector('#items'), state.items, (name) => {
  onItemClick(name, true);
});
