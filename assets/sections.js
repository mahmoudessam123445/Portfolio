/*
  Keeps the page clean while it is still being filled in, and builds the menu.

  1. Any <section data-list> whose list ([data-items]) has no <article> inside is
     hidden, so an empty "Certificates" section never shows up.
  2. The sections that do have content are numbered 01, 02, 03 ... in the order
     they appear, so the numbers stay right whatever you add or remove.
  3. The three-dot menu (top right) lists About plus every section that is
     actually showing, with the same numbers. A hidden section is not in the menu.
     Add or rename a section in index.html and the menu follows by itself.

  You do not need to edit this file.
*/
(function () {
  var sections = document.querySelectorAll('section[data-list]');

  /* 1. hide the empty ones */
  for (var i = 0; i < sections.length; i++) {
    var list = sections[i].querySelector('[data-items]');
    if (list && list.querySelector('article') === null) {
      sections[i].hidden = true;
    }
  }

  /* 2. renumber the visible ones */
  var visible = document.querySelectorAll('section[data-list]:not([hidden])');
  for (var j = 0; j < visible.length; j++) {
    var number = visible[j].querySelector('h2 i');
    if (number) {
      var n = j + 1;
      number.textContent = n < 10 ? '0' + n : String(n);
    }
  }

  /* 3. build the menu */
  var menu = document.getElementById('menu');
  var button = document.getElementById('menu-btn');
  if (!menu || !button) return;

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function addItem(href, label, number) {
    var link = document.createElement('a');
    link.href = href;
    var mark = document.createElement('i');
    mark.textContent = number || '';
    link.appendChild(mark);
    link.appendChild(document.createTextNode(label));
    link.addEventListener('click', close);
    menu.appendChild(link);
  }

  function open() {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
  }

  function close() {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  }

  /* start from an empty list, so running this twice can never double it */
  while (menu.firstChild) menu.removeChild(menu.firstChild);

  addItem('#about', 'About', '');

  for (var k = 0; k < visible.length; k++) {
    var heading = visible[k].querySelector('h2');
    if (!heading) continue;

    var num = '';
    var numEl = heading.querySelector('i');
    if (numEl) num = numEl.textContent.trim();

    var copy = heading.cloneNode(true);
    var copyNum = copy.querySelector('i');
    if (copyNum) copy.removeChild(copyNum);
    var title = copy.textContent.trim();
    if (!title) continue;

    if (!visible[k].id) visible[k].id = slug(title);
    addItem('#' + visible[k].id, title, num);
  }

  /* the button opens and closes it */
  button.addEventListener('click', function (event) {
    event.stopPropagation();
    if (menu.hidden) { open(); } else { close(); }
  });

  /* tapping anywhere else, or Escape, closes it */
  document.addEventListener('click', function (event) {
    if (!menu.hidden && !menu.contains(event.target) && event.target !== button) close();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !menu.hidden) close();
  });
})();
