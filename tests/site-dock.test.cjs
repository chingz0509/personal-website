const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../assets/site-dock.js"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
const styleVersion = html.match(/href="assets\/site-dock\.css\?v=([^"\s]+)"/);
const scriptVersion = html.match(/src="assets\/site-dock\.js\?v=([^"\s]+)"/);
assert(styleVersion && scriptVersion, "Dock CSS and JS need versioned URLs to invalidate cached previews");
assert.equal(styleVersion[1], scriptVersion[1], "Dock assets must load the same release");
const listeners = new Map();
const frames = [];
const dock = {
  dataset: {},
  getBoundingClientRect: () => ({ top: 740, height: 68 }),
};
let scrollY = 0;
const section = (top, bottom) => ({
  getBoundingClientRect: () => ({ top: top - scrollY, bottom: bottom - scrollY }),
});
const sections = {
  top: section(0, 600),
  about: section(600, 1600),
  tools: section(1600, 2600),
};
const links = Object.keys(sections).map((id) => ({
  dataset: { dockSection: id },
  attributes: {},
  setAttribute(name, value) { this.attributes[name] = value; },
  removeAttribute(name) { delete this.attributes[name]; },
}));
const document = {
  querySelector: () => dock,
  querySelectorAll: (selector) => selector === "[data-dock-section]" ? links : [sections.about],
  getElementById: (id) => sections[id],
};
const window = {
  innerHeight: 863,
  addEventListener(type, callback) { listeners.set(type, callback); },
  requestAnimationFrame(callback) { frames.push(callback); },
};
const emit = (type) => listeners.get(type)();
const flush = () => { while (frames.length) frames.shift()(); };
const current = () => links.filter(link => link.attributes["aria-current"] === "location");

vm.runInNewContext(source, { document, window });
assert.equal(dock.dataset.theme, "dark", "dock already over black while hero is still active");
assert.equal(current()[0].dataset.dockSection, "top");

scrollY = 300;
emit("scroll");
emit("scroll");
emit("resize");
assert.equal(frames.length, 1, "scroll and resize share one frame");
flush();
assert.equal(dock.dataset.theme, "dark");
assert.equal(current()[0].dataset.dockSection, "about");
assert.equal(current().length, 1);

scrollY = 826; // Dock center is now exactly at the lower edge of the black section.
emit("scroll");
flush();
assert.equal(dock.dataset.theme, "light");
assert.equal(current()[0].dataset.dockSection, "about", "theme must not depend on active link");

scrollY = 825;
emit("scroll");
flush();
assert.equal(dock.dataset.theme, "dark", "scrolling back restores the dark theme");

dock.getBoundingClientRect = () => ({ top: 400, height: 60 });
scrollY = 0;
emit("resize");
flush();
assert.equal(dock.dataset.theme, "light", "resizing uses the actual dock position");

scrollY = 1700;
emit("hashchange");
flush();
assert.equal(current()[0].dataset.dockSection, "tools");
assert.equal(dock.dataset.theme, "light");
scrollY = 500;
emit("pageshow");
flush();
assert.equal(dock.dataset.theme, "dark", "restored pages recompute their theme");

vm.runInNewContext(source, { document: { querySelector: () => null } });
assert(!("hidden" in dock), "theme changes must never hide the persistent dock");
console.log("Dock checks passed: background-based theme, boundaries, reverse scroll, resize, restored pages and active links.");
