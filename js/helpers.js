const clone = (thing) => JSON.parse(JSON.stringify(thing));
const clearContainer = container => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

const createImage = data => {
  const img = document.createElement('img');
  img.className  = data.className;
  img.name = data.name;
  img.src = `assets/img/${data.src}.png`;

  if (data.onclick) {
    img.addEventListener('click', () => {
      const el = event.target || event.srcElement;

      data.onclick(el.name);

      return false;
    });
  }

  return img;
};

const intersect = (a, b) => {
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
