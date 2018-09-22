module.exports.now = function () {
  return Math.floor(Date.now() / 1000);
}

module.exports.header = function (headerText) {
  /*
   * Gibt 'Überschriften' auf der Konsole aus
   * ================
   * TEST-Überschrift
   * ================
   */
  var line = Array(headerText.length + 1).join('=');
  console.log(`${line}
${headerText}
${line}`)
}