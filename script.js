/* =========================
   LANGUAGE
   Spanish pages live in the root, German pages in /de/ with <html lang="de">.
   T() returns the text for the page's language; ROOT is the path to the
   shared files (images, style.css) from the current page.
========================= */

const LANG = document.documentElement.lang === "de" ? "de" : "es";
const ROOT = LANG === "de" ? "../" : "";

const TEXT = {
  es: {
    viewCart: "Ver carrito",
    addedToCart: "añadido al carrito",
    cartEmpty: "Todavía no agregaste ningún café.",
    removeItem: "Quitar del pedido",
    sending: "Enviando...",
    submitOrder: "Finalizar pedido",
    orderError: "Hubo un problema al enviar tu pedido. Probá de nuevo o escribinos a geckocoffees@gmail.com.",
    submitContact: "Enviar consulta",
    contactThanks: "¡Gracias! Te responderemos a la brevedad.",
    contactError: "Hubo un problema al enviar tu consulta. Escribinos directamente a geckocoffees@gmail.com.",
    whatsapp: "Escribinos por WhatsApp",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    coffees: "Cafés",
    guide: "Guía del café",
    guideConservacion: "Conservación",
    guideReposo: "Reposo y frescura",
    guideMolienda: "Molienda",
    guideAgua: "Agua",
    guidePreparacion: "Preparación",
    info: "Información",
    shipping: "Envíos",
    returns: "Cambios y devoluciones",
    faq: "Preguntas frecuentes",
    roasting: "Tueste y frescura",
    contact: "Contacto",
    tagline: "Café de especialidad",
    shop: "Comprar",
    ourCoffees: "Nuestros cafés",
    howToBuy: "Cómo comprar",
    cart: "Carrito",
    help: "Ayuda",
    videoThumb: "Miniatura del video",
    saleLong: function (pct, day) { return pct + "% de descuento en todos los cafés · hasta el " + day; },
    saleShort: function (pct, day) { return "−" + pct + "% en todos los cafés hasta el " + day; },
    saleLink: "Ver cafés",
    dateLocale: "es-PY"
  },
  de: {
    viewCart: "Zum Warenkorb",
    addedToCart: "in den Warenkorb gelegt",
    cartEmpty: "Du hast noch keinen Kaffee ausgewählt.",
    removeItem: "Aus der Bestellung entfernen",
    sending: "Wird gesendet …",
    submitOrder: "Bestellung abschicken",
    orderError: "Beim Senden deiner Bestellung ist ein Fehler aufgetreten. Bitte versuch es noch einmal oder schreib uns an geckocoffees@gmail.com.",
    submitContact: "Nachricht senden",
    contactThanks: "Vielen Dank! Wir melden uns so schnell wie möglich bei dir.",
    contactError: "Beim Senden deiner Nachricht ist ein Fehler aufgetreten. Schreib uns direkt an geckocoffees@gmail.com.",
    whatsapp: "Schreib uns auf WhatsApp",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    coffees: "Kaffees",
    guide: "Kaffeeratgeber",
    guideConservacion: "Aufbewahrung",
    guideReposo: "Ruhezeit und Frische",
    guideMolienda: "Mahlgrad",
    guideAgua: "Wasser",
    guidePreparacion: "Zubereitung",
    info: "Informationen",
    shipping: "Versand",
    returns: "Umtausch und Rückgabe",
    faq: "Häufige Fragen",
    roasting: "Röstung und Frische",
    contact: "Kontakt",
    tagline: "Spezialitätenkaffee",
    shop: "Einkaufen",
    ourCoffees: "Unsere Kaffees",
    howToBuy: "So bestellst du",
    cart: "Warenkorb",
    help: "Hilfe",
    videoThumb: "Video-Vorschaubild",
    saleLong: function (pct, day) { return pct + " % Rabatt auf alle Kaffees · bis zum " + day; },
    saleShort: function (pct, day) { return "−" + pct + " % auf alle Kaffees bis " + day; },
    saleLink: "Zu den Kaffees",
    dateLocale: "de-DE"
  }
};

function T(key) {
  return TEXT[LANG][key];
}

// Link to the same page in the other language, keeping the #section
function otherLanguageHref() {
  const file = window.location.pathname.split("/").pop() || "index.html";
  const target = (file === "de" || file === "index.html") ? "" : file;
  return (LANG === "de" ? "../" : "de/") + target + window.location.hash;
}

// Grind as stored in the cart → shown in the page's language
const GRIND_NAMES = {
  "En granos": { es: "En granos", de: "Ganze Bohnen" },
  "Ganze Bohnen": { es: "En granos", de: "Ganze Bohnen" }
};

function grindName(grind, lang) {
  return GRIND_NAMES[grind] ? GRIND_NAMES[grind][lang] : grind;
}

function languageSwitchHtml() {
  return (
    '<span class="lang-switch">' +
    (LANG === "es"
      ? '<span class="lang-current" aria-current="true">Español</span><a href="' + otherLanguageHref() + '" hreflang="de" lang="de">Deutsch</a>'
      : '<a href="' + otherLanguageHref() + '" hreflang="es" lang="es">Español</a><span class="lang-current" aria-current="true">Deutsch</span>') +
    '</span>'
  );
}

let order = JSON.parse(localStorage.getItem("geckoOrder") || "[]");

function saveOrder() {
  localStorage.setItem("geckoOrder", JSON.stringify(order));
}

function showToast(message) {
  let toast = document.getElementById("cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.className = "cart-toast";
    toast.innerHTML =
      '<span id="cart-toast-text"></span>' +
      '<a href="cart.html">' + T("viewCart") + '</a>';
    document.body.appendChild(toast);
  }

  document.getElementById("cart-toast-text").textContent = message;
  toast.classList.add("visible");
  clearTimeout(toast._hideTimeout);
  toast._hideTimeout = setTimeout(function () {
    toast.classList.remove("visible");
  }, 3000);
}

/* =========================
   SALE (Black Friday)
   Runs on its own: starts and ends by the dates below (Paraguay time).
   To change or end it, edit SALE. Prices in the HTML stay the full price.
========================= */

const SALE = {
  name: "Black Friday",
  percent: 20,
  start: new Date("2026-11-19T00:00:00-03:00"),
  end: new Date("2026-12-01T00:00:00-03:00")
};

function isSaleActive() {
  const now = new Date();
  return now >= SALE.start && now < SALE.end;
}

function salePrice(fullPrice) {
  return Math.round(fullPrice * (100 - SALE.percent) / 100 / 1000) * 1000;
}

function saleLabel() {
  return SALE.name + " −" + SALE.percent + "%";
}

function priceHtml(fullPrice) {
  return (
    '<s class="price-old">' + formatGs(fullPrice) + '</s>' +
    '<span class="price-new">' + formatGs(salePrice(fullPrice)) + '</span>'
  );
}

function applySale() {
  if (!isSaleActive()) return;

  // Catalogue cards
  document.querySelectorAll(".coffee-card").forEach(function (card) {
    const priceEl = card.querySelector(".coffee-price");
    if (!priceEl || priceEl.dataset.saleApplied) return;
    const fullPrice = Number(priceEl.textContent.replace(/\D/g, ""));
    if (!fullPrice) return;
    priceEl.dataset.saleApplied = "1";
    priceEl.innerHTML = priceHtml(fullPrice);

    const image = card.querySelector(".coffee-image");
    if (image && !image.querySelector(".sale-badge")) {
      const badge = document.createElement("span");
      badge.className = "sale-badge";
      badge.textContent = "−" + SALE.percent + "%";
      image.appendChild(badge);
    }
  });

  // Product page: size buttons, shown price and the page's own selectSize()
  const sizeButtons = document.querySelectorAll(".selection-option[data-price]");
  const shownPrice = document.getElementById("selected-price");
  if (!sizeButtons.length || !shownPrice || typeof window.selectSize !== "function") return;

  sizeButtons.forEach(function (btn) {
    if (btn.dataset.fullPrice) return;
    btn.dataset.fullPrice = btn.dataset.price;
    btn.dataset.price = String(salePrice(Number(btn.dataset.price)));
  });

  function showSalePrice() {
    const active = document.querySelector(".selection-option.active[data-full-price]");
    if (!active) return;
    shownPrice.innerHTML =
      priceHtml(Number(active.dataset.fullPrice)) +
      '<span class="sale-tag">' + saleLabel() + '</span>';
  }

  const pageSelectSize = window.selectSize;
  window.selectSize = function (button) {
    pageSelectSize(button);
    showSalePrice();
  };

  // Re-select the active size so the page's price variables take the sale price
  const active = document.querySelector(".selection-option.active[data-price]") || sizeButtons[0];
  window.selectSize(active);
}

function injectSaleBar() {
  if (!isSaleActive()) return;
  const path = window.location.pathname;
  const isHome = path === "" || /^\/(de\/?)?(index\.html)?$/.test(path);
  if (!isHome || document.querySelector(".sale-bar")) return;

  const end = new Date(SALE.end.getTime() - 1);
  const lastDay = end.toLocaleDateString(T("dateLocale"), { day: "numeric", month: "long", timeZone: "America/Asuncion" });
  const lastDayShort = end.toLocaleDateString(T("dateLocale"), { day: "numeric", month: "numeric", timeZone: "America/Asuncion" });

  const bar = document.createElement("div");
  bar.className = "sale-bar";
  bar.innerHTML =
    '<span class="sale-bar-name">' + SALE.name + '</span>' +
    '<span class="sale-bar-text">' +
      '<span class="sale-bar-long">' + T("saleLong")(SALE.percent, lastDay) + '</span>' +
      '<span class="sale-bar-short">' + T("saleShort")(SALE.percent, lastDayShort) + '</span>' +
    '</span>' +
    '<a href="cafes.html" class="sale-bar-link">' + T("saleLink") + '</a>';
  document.body.insertBefore(bar, document.body.firstChild);
}

function addToOrder(product, grind, size, unitPrice, quantity) {
  quantity = quantity || 1;
  const onSale = isSaleActive() && document.querySelector(".selection-option[data-full-price]") !== null;
  order.push({
    product: product,
    grind: grind,
    size: size,
    unitPrice: unitPrice,
    quantity: quantity,
    sale: onSale ? saleLabel() : null
  });
  saveOrder();
  updateOrder();
  showToast(quantity + " × " + product + " " + T("addedToCart"));
}

function removeFromOrder(index) {
  order.splice(index, 1);
  saveOrder();
  updateOrder();
}

function formatGs(amount) {
  return amount.toLocaleString("es-PY") + " Gs";
}

function updateOrder() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = order.length;
  }

  const list = document.getElementById("order-list");
  const form = document.getElementById("order-form");

  if (!list) return;

  if (!order.length) {
    list.innerHTML =
      '<div class="order-empty">' +
      '<p class="order-empty-title">' + T("cartEmpty") + '</p>' +
      '</div>';
    if (form) form.hidden = true;
  } else {
    list.innerHTML = order
      .map(function (item, index) {
        return (
          '<div class="order-item">' +
          '<span class="order-item-qty">' + item.quantity + ' ×</span>' +
          '<span class="order-item-info">' +
          '<span class="order-item-name">' + item.product + '</span>' +
          '<span class="order-item-detail">' + grindName(item.grind, LANG) + ' · ' + item.size + (item.sale ? ' · <span class="order-item-sale">' + item.sale + '</span>' : '') + '</span>' +
          '</span>' +
          '<span class="order-item-price">' + formatGs(item.unitPrice * item.quantity) + '</span>' +
          '<button type="button" class="remove-item" onclick="removeFromOrder(' + index + ')" aria-label="' + T("removeItem") + '">' +
          '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>' +
          '</button>' +
          '</div>'
        );
      })
      .join("");
    if (form) form.hidden = false;
  }

  const totalEl = document.getElementById("order-total");
  if (totalEl) {
    const total = order.reduce(function (sum, item) {
      return sum + (item.unitPrice * item.quantity);
    }, 0);
    totalEl.textContent = formatGs(total);
  }
}

function submitOrder(event) {
  event.preventDefault();

  if (!order.length) return;

  const details = order
    .map(function (item) {
      return item.quantity + " × " + item.product + " — " + grindName(item.grind, "es") + " — " + item.size + " — " + formatGs(item.unitPrice * item.quantity) + (item.sale ? " (" + item.sale + ")" : "");
    })
    .join("\n");

  const total = order.reduce(function (sum, item) {
    return sum + (item.unitPrice * item.quantity);
  }, 0);

  const payload = {
    "Cliente": document.getElementById("customer-name").value,
    "Email": document.getElementById("customer-email").value,
    "WhatsApp": document.getElementById("customer-phone").value || "No indicado",
    "Direccion de entrega": document.getElementById("customer-address").value,
    "Pedido": details,
    "Total": formatGs(total),
    "_subject": LANG === "de" ? "Nuevo pedido (alemán) - Gecko Coffee" : "Nuevo pedido - Gecko Coffee"
  };
  if (LANG === "de") payload["Idioma"] = "Alemán (pedido desde la web en alemán)";

  const submitButton = event.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = T("sending");

  fetch("https://formsubmit.co/ajax/geckocoffees@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(function (response) {
      if (!response.ok) throw new Error("Error al enviar el pedido");
      return response.json();
    })
    .then(function () {
      order = [];
      saveOrder();
      updateOrder();
      document.getElementById("cart-view").hidden = true;
      document.getElementById("thank-you-view").hidden = false;
    })
    .catch(function () {
      submitButton.disabled = false;
      submitButton.textContent = T("submitOrder");
      document.getElementById("order-message").textContent = T("orderError");
    });
}

function submitContactForm(event) {
  event.preventDefault();

  const payload = {
    "Nombre": document.getElementById("contact-name").value,
    "Email": document.getElementById("contact-email").value,
    "Consulta": document.getElementById("contact-message").value,
    "_subject": LANG === "de" ? "Nueva consulta (alemán) - Gecko Coffee" : "Nueva consulta - Gecko Coffee"
  };
  if (LANG === "de") payload["Idioma"] = "Alemán";

  const submitButton = event.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = T("sending");

  fetch("https://formsubmit.co/ajax/geckocoffees@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(function (response) {
      if (!response.ok) throw new Error("Error al enviar la consulta");
      return response.json();
    })
    .then(function () {
      event.target.reset();
      submitButton.disabled = false;
      submitButton.textContent = T("submitContact");
      document.getElementById("contact-form-message").textContent = T("contactThanks");
    })
    .catch(function () {
      submitButton.disabled = false;
      submitButton.textContent = T("submitContact");
      document.getElementById("contact-form-message").textContent = T("contactError");
    });
}

function injectWhatsappFloat() {
  if (document.getElementById("whatsapp-float")) return;
  const link = document.createElement("a");
  link.id = "whatsapp-float";
  link.className = "whatsapp-float";
  link.href = "https://wa.me/595981197868";
  link.target = "_blank";
  link.setAttribute("aria-label", T("whatsapp"));
  link.innerHTML =
    '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.464 3.484 1.345 4.997L2 22l5.144-1.334a9.96 9.96 0 0 0 4.86 1.237h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.182-2.929-7.07a9.935 9.935 0 0 0-7.072-2.833zm0 18.187h-.003a8.19 8.19 0 0 1-4.17-1.144l-.299-.177-3.055.793.816-2.978-.194-.306a8.19 8.19 0 0 1-1.255-4.377c0-4.527 3.68-8.207 8.207-8.207 2.192 0 4.252.854 5.802 2.406a8.15 8.15 0 0 1 2.4 5.805c0 4.527-3.68 8.185-8.25 8.185z"/></svg>';
  document.body.appendChild(link);
}

function injectSideMenu() {
  if (document.getElementById("side-menu")) return;

  const header = document.querySelector(".site-header");
  const logo = document.querySelector(".site-header .logo");
  if (!header || !logo) return;

  const toggle = document.createElement("button");
  toggle.id = "menu-toggle";
  toggle.className = "menu-toggle";
  toggle.setAttribute("aria-label", T("openMenu"));
  toggle.innerHTML =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

  const wrapper = document.createElement("div");
  wrapper.className = "header-left";
  header.insertBefore(wrapper, logo);
  wrapper.appendChild(toggle);
  wrapper.appendChild(logo);

  const overlay = document.createElement("div");
  overlay.id = "side-menu-overlay";
  overlay.className = "side-menu-overlay";

  const menu = document.createElement("nav");
  menu.id = "side-menu";
  menu.className = "side-menu";
  menu.innerHTML =
    '<button id="menu-close" class="menu-close" aria-label="' + T("closeMenu") + '">' +
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>' +
    '</button>' +
    '<div class="side-menu-logo">' +
    '<img src="' + ROOT + 'logo-gecko.png" alt="Gecko Coffee">' +
    '<span>GECKO<span>COFFEE</span></span>' +
    '</div>' +
    '<ul class="side-menu-list">' +
    '<li><a href="cafes.html">' + T("coffees") + '</a></li>' +

    '<li class="side-menu-group">' +
    '<button type="button" class="side-menu-group-toggle" aria-expanded="false">' +
    '<span>' + T("guide") + '</span>' +
    '<svg class="side-menu-arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>' +
    '</button>' +
    '<ul class="side-menu-sublist">' +
    '<li><a href="guia-del-cafe.html#conservacion">' + T("guideConservacion") + '</a></li>' +
    '<li><a href="guia-del-cafe.html#reposo">' + T("guideReposo") + '</a></li>' +
    '<li><a href="guia-del-cafe.html#molienda">' + T("guideMolienda") + '</a></li>' +
    '<li><a href="guia-del-cafe.html#agua">' + T("guideAgua") + '</a></li>' +
    '<li><a href="guia-del-cafe.html#preparacion">' + T("guidePreparacion") + '</a></li>' +
    '</ul>' +
    '</li>' +

    '<li class="side-menu-group">' +
    '<button type="button" class="side-menu-group-toggle" aria-expanded="false">' +
    '<span>' + T("info") + '</span>' +
    '<svg class="side-menu-arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>' +
    '</button>' +
    '<ul class="side-menu-sublist">' +
    '<li><a href="informacion.html#envios">' + T("shipping") + '</a></li>' +
    '<li><a href="informacion.html#cambios">' + T("returns") + '</a></li>' +
    '<li><a href="informacion.html#preguntas">' + T("faq") + '</a></li>' +
    '<li><a href="informacion.html#tueste">' + T("roasting") + '</a></li>' +
    '</ul>' +
    '</li>' +

    '<li><a href="index.html#contacto">' + T("contact") + '</a></li>' +
    '</ul>' +
    '<div class="side-menu-lang">' + languageSwitchHtml() + '</div>';

  document.body.appendChild(overlay);
  document.body.appendChild(menu);

  function openMenu() {
    menu.classList.add("open");
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menu.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", openMenu);
  document.getElementById("menu-close").addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  menu.querySelectorAll(".side-menu-group-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const group = btn.closest(".side-menu-group");
      const isOpen = group.classList.toggle("expanded");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
}

function initGuideAccordion() {
  const items = document.querySelectorAll(".guide-item");
  if (!items.length) return;

  items.forEach(function (item) {
    const btn = item.querySelector(".guide-toggle");
    btn.addEventListener("click", function () {
      const isOpen = item.classList.toggle("expanded");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const target = document.getElementById(hash);
    if (target && target.classList.contains("guide-item")) {
      target.classList.add("expanded");
      const btn = target.querySelector(".guide-toggle");
      if (btn) btn.setAttribute("aria-expanded", "true");
      setTimeout(function () {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }
}

function initGuideVideos() {
  document.querySelectorAll(".guide-video[data-video-id]").forEach(function (el) {
    const videoId = el.dataset.videoId;
    if (!videoId) return;

    el.innerHTML =
      '<img src="https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg" alt="' + T("videoThumb") + '">' +
      '<div class="guide-video-play">' +
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>' +
      '</div>';

    el.addEventListener("click", function () {
      el.innerHTML =
        '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    }, { once: true });
  });
}

function injectFooter() {
  const footer = document.querySelector("footer");
  if (!footer || footer.dataset.enhanced) return;
  footer.dataset.enhanced = "true";

  footer.innerHTML =
    '<div class="footer-grid">' +

    '<div class="footer-brand">' +
    '<p class="footer-wordmark">Gecko Coffee</p>' +
    '<p class="footer-tagline">' + T("tagline") + '</p>' +
    '<div class="footer-social">' +
    '<a href="https://www.instagram.com/geckocoffeepy" target="_blank" aria-label="Instagram">' +
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none"></circle></svg>' +
    '</a>' +
    '<a href="https://www.facebook.com" target="_blank" aria-label="Facebook">' +
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 3h-2a5 5 0 0 0-5 5v2H6v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z"></path></svg>' +
    '</a>' +
    '</div>' +
    '</div>' +

    '<div class="footer-column">' +
    '<h4>' + T("shop") + '</h4>' +
    '<ul>' +
    '<li><a href="cafes.html">' + T("ourCoffees") + '</a></li>' +
    '<li><a href="guia-del-cafe.html">' + T("howToBuy") + '</a></li>' +
    '<li><a href="cart.html">' + T("cart") + '</a></li>' +
    '</ul>' +
    '</div>' +

    '<div class="footer-column">' +
    '<h4>' + T("help") + '</h4>' +
    '<ul>' +
    '<li><a href="guia-del-cafe.html">' + T("guide") + '</a></li>' +
    '<li><a href="informacion.html#envios">' + T("shipping") + '</a></li>' +
    '<li><a href="informacion.html#cambios">' + T("returns") + '</a></li>' +
    '<li><a href="informacion.html#preguntas">' + T("faq") + '</a></li>' +
    '<li><a href="informacion.html#tueste">' + T("roasting") + '</a></li>' +
    '</ul>' +
    '</div>' +

    '<div class="footer-column footer-contact">' +
    '<h4>' + T("contact") + '</h4>' +
    '<ul class="footer-contact-list">' +
    '<li>' +
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"></path><circle cx="12" cy="9.5" r="2.3"></circle></svg>' +
    '<span>Ciudad del Este, Paraguay</span>' +
    '</li>' +
    '<li>' +
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path></svg>' +
    '<a href="https://wa.me/595981197868" target="_blank">+595 981 197 868</a>' +
    '</li>' +
    '<li>' +
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 6-10 7L2 6"></path></svg>' +
    '<a href="mailto:geckocoffees@gmail.com">geckocoffees@gmail.com</a>' +
    '</li>' +
    '</ul>' +
    '</div>' +

    '</div>' +
    '<div class="footer-bottom">' +
    '<p>© 2026 Gecko Coffee · ' + T("tagline") + '</p>' +
    languageSwitchHtml() +
    '</div>';
}

function injectFavicon() {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/png";
  link.href = ROOT + "logo-gecko.png";
}

injectFavicon();
injectSaleBar();
applySale();
injectWhatsappFloat();
injectSideMenu();
injectFooter();
initGuideAccordion();
initGuideVideos();
updateOrder();
