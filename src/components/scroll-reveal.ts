/** Below-fold fade for browsers without animation-timeline: view(). */
export const REVEAL_RUNTIME = `(function(){
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.CSS && CSS.supports && CSS.supports("animation-timeline: view()")) return;
  var vh = window.innerHeight || 0;
  var pending = [];
  function consider(node, kind){
    if (node.getBoundingClientRect().top <= vh * 0.9) return;
    node.classList.add(kind);
    pending.push(node);
  }
  document.querySelectorAll("[data-reveal]").forEach(function(node){ consider(node, "jdc-wait"); });
  document.querySelectorAll(".jdc-plate").forEach(function(node){ consider(node, "jdc-draw-wait"); });
  if (!pending.length || !("IntersectionObserver" in window)) {
    pending.forEach(function(node){
      node.classList.remove("jdc-wait");
      node.classList.remove("jdc-draw-wait");
    });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (!entry.isIntersecting) return;
      var node = entry.target;
      var step = node.getAttribute("data-step");
      var delay = 0;
      if (step) delay = Number(step) * 70;
      else if (node.classList.contains("jdc-card")) {
        var i = 0;
        var sib = node;
        while (sib.previousElementSibling) { i += 1; sib = sib.previousElementSibling; }
        delay = Math.min(i, 5) * 60;
      }
      window.setTimeout(function(){ node.classList.add("jdc-in"); }, delay);
      io.unobserve(node);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  pending.forEach(function(node){ io.observe(node); });
})();`;
