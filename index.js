Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
            return this;
        }
    }
    return this;
};

clone = (thing) => JSON.parse(JSON.stringify(thing));

intersect = (a, b) => {
  const both = [];
  const aClone = clone(a);
  const bClone = clone(b);

  aClone.forEach(ae => {
    if (bClone.indexOf(ae) !== -1) {
      both.push(ae);
      bClone.remove(ae);
    }
  });

  return both;
};

const data = JSON.parse(document.querySelector('#data').innerText);
const state = {
  builtItems: [],
  buildableItems: [],
  possibleItems: [],
  acquiredItems: [],
  items: data.items
};

const createImage = item => {
  const img = document.createElement('img');
  img.className  = 'item';
  img.name = item;
  img.src = 'assets/img/' + item + '.png';

  return img;
}

const loadItems = (container, items, cb) => {
  for (item of items) {
    loadItem(container, item, cb);
  }
};

const loadItem = (container, item, callback) => {
  const img = createImage(item);
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
    const img = createImage(builtItem.img);

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

    const img = createImage(buildableItem.img);
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
      const componentImg = createImage(component.name);

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

    div.appendChild(img);
    div.appendChild(componentContainer);
    div.appendChild(detailsContainer);
    container.appendChild(div);
  }
};

const update = () => {
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
