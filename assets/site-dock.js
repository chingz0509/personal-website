(() => {
  const destinations = [...document.querySelectorAll("[data-dock-section]")]
    .map((link) => ({ link, section: document.getElementById(link.dataset.dockSection) }))
    .filter(({ section }) => section);
  if (!destinations.length) return;

  let framePending = false;
  const update = () => {
    framePending = false;
    let current = destinations[0];
    for (const destination of destinations) {
      if (destination.section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
        current = destination;
      }
    }
    for (const destination of destinations) {
      if (destination === current) destination.link.setAttribute("aria-current", "location");
      else destination.link.removeAttribute("aria-current");
    }
  };
  const scheduleUpdate = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  update();
})();
