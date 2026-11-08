(() => {
  if (typeof window.matchMedia !== "function") return;

  const allowed = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  );
  const dotCount = 8;
  const fadeDelay = 80;
  const fadeDuration = 400;
  let layer;
  let dots = [];
  let frameId = null;
  let previousFrame = 0;
  let lastMove = 0;
  let startedAt = 0;
  let targetX = 0;
  let targetY = 0;

  const hide = () => {
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    frameId = null;
    previousFrame = 0;
    if (layer) layer.hidden = true;
  };

  const createTrail = () => {
    layer = document.createElement("div");
    layer.className = "cursor-trail";
    layer.setAttribute("aria-hidden", "true");
    layer.hidden = true;
    dots = Array.from({ length: dotCount }, (_, index) => {
      const element = document.createElement("span");
      const size = 14 - index * 1.4;
      element.className = "cursor-trail-dot";
      element.style.setProperty("--trail-size", `${size}px`);
      element.style.setProperty("--trail-alpha", (0.4 - index * 0.045).toFixed(3));
      layer.appendChild(element);
      return { element, size, x: targetX, y: targetY };
    });
    document.body.appendChild(layer);
  };

  const render = (now) => {
    frameId = null;
    if (!allowed.matches || document.hidden) {
      hide();
      return;
    }
    const idleTime = now - lastMove;
    if (idleTime >= fadeDelay + fadeDuration) {
      hide();
      return;
    }

    // Normalize the easing to elapsed time rather than the display's refresh rate.
    const elapsed = previousFrame ? Math.min(now - previousFrame, 64) : 1000 / 60;
    const follow = 1 - Math.pow(0.8, elapsed / (1000 / 60));
    previousFrame = now;
    let x = targetX;
    let y = targetY;
    for (const dot of dots) {
      dot.x += (x - dot.x) * follow;
      dot.y += (y - dot.y) * follow;
      dot.element.style.transform = `translate3d(${dot.x - dot.size / 2}px, ${dot.y - dot.size / 2}px, 0)`;
      x = dot.x;
      y = dot.y;
    }
    const fadeIn = Math.min(1, (now - startedAt) / 80);
    const fadeOut = 1 - Math.max(0, idleTime - fadeDelay) / fadeDuration;
    layer.style.opacity = String(fadeIn * fadeOut);
    frameId = window.requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", (event) => {
    if (!allowed.matches || document.hidden || event.pointerType !== "mouse") {
      hide();
      return;
    }
    // Offset the decoration so that the native cursor remains easy to see.
    targetX = event.clientX + 10;
    targetY = event.clientY + 14;
    lastMove = performance.now();
    if (!layer) createTrail();
    if (layer.hidden) {
      for (const dot of dots) {
        dot.x = targetX;
        dot.y = targetY;
      }
      startedAt = lastMove;
      layer.style.opacity = "0";
      layer.hidden = false;
    }
    if (frameId === null) frameId = window.requestAnimationFrame(render);
  }, { passive: true });

  window.addEventListener("blur", hide);
  window.addEventListener("pagehide", hide);
  window.addEventListener("pointercancel", hide);
  document.documentElement.addEventListener("pointerleave", hide);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide();
  });
  if (typeof allowed.addEventListener === "function") {
    allowed.addEventListener("change", hide);
  } else if (typeof allowed.addListener === "function") {
    allowed.addListener(hide);
  }
})();
