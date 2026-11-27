/*
  Lets you use a Google Drive link as an image on this page.

  1. Upload the photo to Google Drive.
  2. Right-click it (or long-press on the phone) > Share > General access >
     "Anyone with the link", then Copy link.
  3. Paste that link where the image is, for example:
       <img src="https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing">
     or, keeping your own file as a backup:
       <img data-drive="https://drive.google.com/file/d/1AbCd.../view" src="assets/photo.jpg">

  The file has to be shared as "Anyone with the link", otherwise Google will
  not show it to visitors. This script only rewrites the address; nothing is
  uploaded anywhere.
*/
(function () {
  function idFrom(text) {
    if (!text) return null;
    var patterns = [/\/file\/d\/([A-Za-z0-9_-]{10,})/, /[?&]id=([A-Za-z0-9_-]{10,})/, /\/d\/([A-Za-z0-9_-]{10,})/];
    for (var i = 0; i < patterns.length; i++) {
      var match = text.match(patterns[i]);
      if (match) return match[1];
    }
    return null;
  }

  var images = document.querySelectorAll('img[data-drive], img[src*="drive.google.com"]');
  for (var i = 0; i < images.length; i++) {
    var img = images[i];
    var id = idFrom(img.getAttribute('data-drive') || img.getAttribute('src'));
    if (!id) continue;
    img.setAttribute('data-drive-id', id);
    img.onerror = function () {
      this.onerror = null;
      this.src = 'https://drive.google.com/thumbnail?id=' + this.getAttribute('data-drive-id') + '&sz=w1600';
    };
    img.src = 'https://lh3.googleusercontent.com/d/' + id + '=w1600';
  }
})();
