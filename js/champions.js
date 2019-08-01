const normalize = str => str
  .replace("'", '')
  .replace(" ", '')
  .toLowerCase();

const normalizedChamps = Object.keys(state.champs).map(normalize);
const filterNormalizedChamps = q => {
  if (q.length < 3) {
    return [];
  } else {
    return normalizedChamps.filter(c => c.includes(q))
  }
};

const champSearch = () => {
  const query = normalize(document.querySelector('#champ-search').value);
  const filteredChamps = filterNormalizedChamps(query);

  loadChamps(document.querySelector('#champs'), filteredChamps, name => {
    onChampClick(name, true);
  });
};

const onChampClick = (champ, add) => {
  if (add) {
    state.acquiredChamps.push(champ);
  } else {
    state.acquiredChamps.remove(champ);
  }

  update();
};

const createChampImage = (champ, cb) => {
  const imgNameNormalized = champ;
  const imgName = imgNameNormalized.charAt(0).toUpperCase() + imgNameNormalized.slice(1)

  return createImage({
    className: 'champ',
    name: champ,
    src: `champ/${imgName}`,
    onclick: cb
  });
};

const loadChamps = (container, champs, cb) => {
  clearContainer(container);

  champs.forEach(
    champ => loadChamp(container, champ, cb)
  );
};

const loadChamp = (container, champ, cb) => {
  const img = createChampImage(champ, cb);

  container.appendChild(img);
};

const loadAcquiredChamps = () => {
  const container = document.querySelector('#acquired-champs');

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  loadChamps(container, state.acquiredChamps, name => {
    onChampClick(name, false);
  });
}

const updateChamps = () => {
  loadAcquiredChamps();
};
