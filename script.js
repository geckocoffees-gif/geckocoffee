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
    toast.innerHTML = '<span id="cart-toast-text"></span><a href="cart.html">Ver carrito</a>';
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
    list.innerHTML = '<p class="empty">Todavía no agregaste ningún café.</p>';
    if (form) form.hidden = true;
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

updateOrder();
