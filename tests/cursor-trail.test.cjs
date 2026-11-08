const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../assets/cursor-trail.js"), "utf8");
const eventTarget = () => {
  const listeners = new Map();
  return {
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(callback);
    },
    emit(type, event = {}) {
      for (const listener of listeners.get(type) || []) listener(event);
    },
  };
};

const setup = (matches = true) => {
  let now = 100;
  let nextId = 0;
  const frames = new Map();
  const body = { children: [], appendChild(child) { this.children.push(child); } };
  const media = Object.assign(eventTarget(), { matches });
  const document = Object.assign(eventTarget(), {
    body,
    hidden: false,
    documentElement: eventTarget(),
    createElement() {
      return {
        children: [],
        attributes: {},
        style: { setProperty(name, value) { this[name] = value; } },
        setAttribute(name, value) { this.attributes[name] = value; },
        appendChild(child) { this.children.push(child); },
      };
    },
  });
  const window = Object.assign(eventTarget(), {
    matchMedia: () => media,
    requestAnimationFrame(callback) { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame(id) { frames.delete(id); },
  });
  vm.runInNewContext(source, { window, document, performance: { now: () => now } });
  return {
    window, document, media, body, frames,
    move(x = 100, y = 200, pointerType = "mouse") {
      window.emit("pointermove", { clientX: x, clientY: y, pointerType });
    },
    tick(ms = 16) {
      now += ms;
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(now);
    },
  };
};

// Coarse pointers / reduced motion: no decorative DOM or animation work.
const disabled = setup(false);
disabled.move();
assert.equal(disabled.body.children.length, 0);
assert.equal(disabled.frames.size, 0);
const touch = setup();
touch.move(10, 10, "touch");
assert.equal(touch.body.children.length, 0);

const run = setup();
assert.equal(run.frames.size, 0);
run.move();
const layer = run.body.children[0];
assert.equal(layer.children.length, 8);
assert.equal(layer.attributes["aria-hidden"], "true");
assert.equal(run.frames.size, 1);
for (let i = 0; i < 20; i++) run.move(200 + i, 250 + i);
assert.equal(run.body.children.length, 1);
assert.equal(run.frames.size, 1, "pointer events must share one animation frame");
run.tick();
assert.equal(layer.hidden, false);
assert(Number(layer.style.opacity) > 0);
assert.notEqual(layer.children[0].style.transform, layer.children[7].style.transform);
assert(!layer.children.some(dot => /NaN|Infinity/.test(dot.style.transform)));
assert(parseFloat(layer.children[0].style["--trail-size"]) > parseFloat(layer.children[7].style["--trail-size"]));
assert(Number(layer.children[0].style["--trail-alpha"]) > Number(layer.children[7].style["--trail-alpha"]));
run.tick(500);
assert.equal(layer.hidden, true);
assert.equal(run.frames.size, 0, "idle animation must stop");

for (const [target, event] of [
  [run.window, "blur"], [run.window, "pagehide"],
  [run.window, "pointercancel"], [run.document.documentElement, "pointerleave"],
]) {
  run.move();
  target.emit(event);
  assert.equal(layer.hidden, true, event);
  assert.equal(run.frames.size, 0, event);
}
run.move();
run.move(10, 10, "touch");
assert.equal(layer.hidden, true);
run.move();
run.document.hidden = true;
run.document.emit("visibilitychange");
assert.equal(layer.hidden, true);
assert.equal(run.frames.size, 0);
run.document.hidden = false;
run.move();
run.media.matches = false;
run.media.emit("change");
assert.equal(layer.hidden, true);
assert.equal(run.frames.size, 0);
run.move();
assert.equal(run.frames.size, 0);
run.media.matches = true;
run.move(500, 600);
run.tick();
assert.equal(layer.hidden, false);
assert.equal(run.body.children.length, 1, "reactivation must reuse the trail");
assert.equal(run.frames.size, 1);
console.log("Cursor trail checks passed: following, fade-out, idle shutdown, mouse-only, reduced motion and lifecycle cleanup.");
