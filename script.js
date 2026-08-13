let order = [];

function addToOrder(product, grind, size, unitPrice, quantity) {
  quantity = quantity || 1;
  order.push({
    product: product,
    grind: grind,
    size: size,
    unitPrice: unitPrice,
    quantity: quantity
  });
  updateOrder();

  const cartSection = document.querySelector("#pedido");
  if (cartSection) {
    cartSection.scrollIntoView({ behavior: "smooth" });
  }
}

function removeFromOrder(index) {
  order.splice(index, 1);
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
  if (!list) return;

  if (!order.length) {
    list.innerHTML = '<p class="empty">Todavía no agregaste ningún café.</p>';
  } else {
    list.innerHTML = order
      .map(function (item, index) {
        return (
          '<div class="order-item">' +
          "<span>" + item.quantity + " × " + item.product + " — " + item.grind + " — " + item.size + "</span>" +
          "<strong>" + formatGs(item.unitPrice * item.quantity) + "</strong>" +
          '<button type="button" class="remove-item" onclick="removeFromOrder(' + index + ')">✕</button>' +
          "</div>"
        );
      })
      .join("");
  }

  const totalEl = document.getElementById("order-total");
  if (totalEl) {
    const total = order.reduce(function (sum, item) {
      return sum + (item.unitPrice * item.quantity);
    }, 0);
    totalEl.textContent = formatGs(total);
  }
}

function showOrderForm() {
  if (!order.length) {
    alert("Primero agregá al menos un café a tu pedido.");
    return;
  }
  document.getElementById("order-form").hidden = false;
}

function submitOrder(event) {
  event.preventDefault();

  const details = order
    .map(function (item) {
      return item.quantity + " × " + item.product + " — " + item.grind + " — " + item.size + " — " + formatGs(item.unitPrice * item.quantity);
    })
    .join("\n");

  const total = order.reduce(function (sum, item) {
    return sum + (item.unitPrice * item.quantity);
  }, 0);

  const message =
    "Nuevo pedido Gecko Coffee\n\n" +
    details + "\n\n" +
    "Total: " + formatGs(total) + "\n\n" +
    "Nombre: " + document.getElementById("customer-name").value + "\n" +
    "WhatsApp: " + document.getElementById("customer-phone").value + "\n" +
    "Email: " + document.getElementById("customer-email").value + "\n" +
    "Entrega: " + document.getElementById("customer-address").value;

  /*
    TEMPORARY WHATSAPP NUMBER
    Replace with the real Gecko Coffee WhatsApp number.
  */
  const whatsapp = "595000000000";
  window.open(
    "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(message),
    "_blank"
  );

  document.getElementById("order-message").textContent =
    "Tu pedido está listo para enviar por WhatsApp.";
}
