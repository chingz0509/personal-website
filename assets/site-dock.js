(() => {
  const dock = document.querySelector(".site-dock");
  if (!dock) return;
  const darkSections = [...document.querySelectorAll('[data-dock-theme="dark"]')];
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
    // Follow the background behind the dock, independently of the active section.
    const dockBounds = dock.getBoundingClientRect();
    const sampleY = dockBounds.top + dockBounds.height / 2;
    const onDark = darkSections.some((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= sampleY && bounds.bottom > sampleY;
    });
    dock.dataset.theme = onDark ? "dark" : "light";
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
