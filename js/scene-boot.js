// scene-boot.js
// A-Frame requires its custom elements to be defined BEFORE <a-scene> is attached,
// otherwise the scene does nothing (blank canvas). To keep A-Frame off the critical
// render path, the scene markup lives inside <template id="scene-template"> (inert
// until cloned) and is attached here, after the deferred aframe.min.js has executed.
(function () {
    var tpl = document.getElementById('scene-template');
    if (!tpl || !tpl.content) return;
    tpl.parentNode.insertBefore(tpl.content.cloneNode(true), tpl.nextSibling);
})();
