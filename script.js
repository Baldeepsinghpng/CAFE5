/* ===== EDIT THIS BLOCK FIRST =====
   Replace placeholders only after the owner gives permission and accurate details. */
const CONFIG = {
  brand: "Golden Hour Kitchen",
  phoneLink: "+910000000000",
  whatsapp: "910000000000",
  whatsappMessage: "Hello, I have a question",
  mapsQuery: "Your Cafe Address Here",
  maxParty: 12,
  minParty: 1
};

(function () {
  "use strict";

  document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = CONFIG.brand; });
  document.querySelectorAll("[data-tel]").forEach(function (el) { el.href = "tel:" + CONFIG.phoneLink; });
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(CONFIG.whatsappMessage);
  });
  document.querySelectorAll("[data-maps]").forEach(function (el) {
    el.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);
  });

  /* mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  function setNav(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  }
  toggle.addEventListener("click", function () { setNav(!nav.classList.contains("open")); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

  /* accessible menu tabs (click + arrow keys) */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = document.querySelectorAll(".list");
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("on", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) { p.hidden = p.dataset.panel !== tab.dataset.tab; });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* reservation inquiry: validation only. Nothing is sent or booked. */
  var form = document.getElementById("resForm");
  var result = document.getElementById("result");
  var party = CONFIG.minParty < 2 ? 2 : CONFIG.minParty;
  var partyOut = document.getElementById("party");
  var dateInput = document.getElementById("rdate");
  partyOut.textContent = party;
  document.getElementById("inc").addEventListener("click", function () { if (party < CONFIG.maxParty) partyOut.textContent = ++party; });
  document.getElementById("dec").addEventListener("click", function () { if (party > CONFIG.minParty) partyOut.textContent = --party; });

  var today = new Date();
  dateInput.min = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

  function checkField(input) {
    var wrap = input.closest(".f");
    var err = wrap.querySelector(".err");
    var v = input.value.trim();
    var msg = "";
    if (!v) msg = "Please fill this in.";
    else if (input.id === "rphone" && v.replace(/\D/g, "").length < 10) msg = "Enter a phone number with at least 10 digits.";
    else if (input.id === "rdate" && v < dateInput.min) msg = "Please choose today or a future date.";
    wrap.classList.toggle("bad", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    err.textContent = msg;
    return !msg;
  }
  var textInputs = [document.getElementById("rname"), document.getElementById("rphone"), dateInput];
  textInputs.forEach(function (i) { i.addEventListener("blur", function () { checkField(i); }); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    var firstBad = null;
    textInputs.forEach(function (i) { if (!checkField(i)) { ok = false; if (!firstBad) firstBad = i; } });
    var slot = form.querySelector("input[name=slot]:checked");
    var slotErr = document.getElementById("slotErr");
    slotErr.textContent = slot ? "" : "Please pick a time.";
    if (!slot) { ok = false; if (!firstBad) firstBad = form.querySelector("input[name=slot]"); }
    result.className = "result";
    if (!ok) {
      result.classList.add("no");
      result.textContent = "Please fix the highlighted fields.";
      if (firstBad) firstBad.focus();
      return;
    }
    result.classList.add("ok");
    result.textContent = "Demo only: " + party + " guest" + (party > 1 ? "s" : "") + " at " + slot.value + " on " + dateInput.value +
      " looks valid, but nothing was sent or booked.";
    form.reset();
    party = 2; partyOut.textContent = party;
  });

  /* reveal on scroll */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (i) { io.observe(i); });
  } else { items.forEach(function (i) { i.classList.add("in"); }); }

  /* image fallback */
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () { img.style.opacity = "0"; });
  });
})();
