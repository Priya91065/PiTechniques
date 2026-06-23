/**
 * footer.php inline behaviours, reproduced with plain DOM APIs and shared by
 * every faithful page: mobile menu toggle, scroll-to-top, and the
 * grey-section observer that recolours the scroll-to-top button.
 */
export function initInlineBehaviours(): void {
  const menuIcon = document.querySelector<HTMLElement>(".menu-icon");
  const menu = document.querySelector<HTMLElement>(".menu");
  const header = document.querySelector<HTMLElement>(".header");
  menuIcon?.addEventListener("click", () => {
    menu?.classList.toggle("maxHeight");
    header?.classList.toggle("h-100");
  });

  const scrollBtn = document.querySelector<HTMLElement>(".scrolltotop");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !scrollBtn) return;
        if (entry.target.classList.contains("grey-section")) {
          scrollBtn.classList.add("border-black");
        } else {
          scrollBtn.classList.remove("border-black");
        }
      });
    },
    { threshold: 0 },
  );
  document.querySelectorAll("section").forEach((s) => observer.observe(s));

  const toTop = document.querySelector<HTMLElement>(".scrolltotop-new");
  const isIOS =
    /iP(ad|hone|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const handler = (e: Event) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  toTop?.addEventListener(isIOS ? "touchstart" : "click", handler, {
    passive: false,
  });
}
