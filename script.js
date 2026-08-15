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
      '<a href="cart.html">Ver carrito</a>';
    document.body.appendChild(toast);
  }

  document.getElementById("cart-toast-text").textContent = message;
  toast.classList.add("visible");
  clearTimeout(toast._hideTimeout);
  toast._hideTimeout = setTimeout(function () {
    toast.classList.remove("visible");
  }, 3000);
}

function addToOrder(product, grind, size, unitPrice, quantity) {
  quantity = quantity || 1;
  order.push({
    product: product,
    grind: grind,
    size: size,
    unitPrice: unitPrice,
    quantity: quantity
  });
  saveOrder();
  updateOrder();
  showToast(quantity + " × " + product + " añadido al carrito");
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
      '<p class="order-empty-title">Todavía no agregaste ningún café.</p>' +
      '<p class="order-empty-sub">Elegí un grano y volvé por acá.</p>' +
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
          '<span class="order-item-detail">' + item.grind + ' · ' + item.size + '</span>' +
          '</span>' +
          '<span class="order-item-price">' + formatGs(item.unitPrice * item.quantity) + '</span>' +
          '<button type="button" class="remove-item" onclick="removeFromOrder(' + index + ')" aria-label="Quitar del pedido">' +
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
      return item.quantity + " × " + item.product + " — " + item.grind + " — " + item.size + " — " + formatGs(item.unitPrice * item.quantity);
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
    "_subject": "Nuevo pedido - Gecko Coffee"
  };

  const submitButton = event.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

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
      submitButton.textContent = "Finalizar pedido";
      document.getElementById("order-message").textContent =
        "Hubo un problema al enviar tu pedido. Probá de nuevo o escribinos a geckocoffees@gmail.com.";
    });
}

function submitContactForm(event) {
  event.preventDefault();

  const payload = {
    "Nombre": document.getElementById("contact-name").value,
    "Email": document.getElementById("contact-email").value,
    "Consulta": document.getElementById("contact-message").value,
    "_subject": "Nueva consulta - Gecko Coffee"
  };

  const submitButton = event.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

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
      submitButton.textContent = "Enviar consulta";
      document.getElementById("contact-form-message").textContent =
        "¡Gracias! Te responderemos a la brevedad.";
    })
    .catch(function () {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar consulta";
      document.getElementById("contact-form-message").textContent =
        "Hubo un problema al enviar tu consulta. Escribinos directamente a geckocoffees@gmail.com.";
    });
}

function injectWhatsappFloat() {
  if (document.getElementById("whatsapp-float")) return;
  const link = document.createElement("a");
  link.id = "whatsapp-float";
  link.className = "whatsapp-float";
  link.href = "https://wa.me/595981197868";
  link.target = "_blank";
  link.setAttribute("aria-label", "Escribinos por WhatsApp");
  link.innerHTML =
    '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.464 3.484 1.345 4.997L2 22l5.144-1.334a9.96 9.96 0 0 0 4.86 1.237h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.182-2.929-7.07a9.935 9.935 0 0 0-7.072-2.833zm0 18.187h-.003a8.19 8.19 0 0 1-4.17-1.144l-.299-.177-3.055.793.816-2.978-.194-.306a8.19 8.19 0 0 1-1.255-4.377c0-4.527 3.68-8.207 8.207-8.207 2.192 0 4.252.854 5.802 2.406a8.15 8.15 0 0 1 2.4 5.805c0 4.527-3.68 8.185-8.25 8.185z"/></svg>';
  document.body.appendChild(link);
}

injectWhatsappFloat();
updateOrder();
