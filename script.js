let order = [];

function addToOrder(name) {
  order.push(name);

  updateOrder();

  document.querySelector("#pedido").scrollIntoView({
    behavior: "smooth"
  });
}


function updateOrder() {

  document.getElementById("cart-count").textContent = order.length;

  const list = document.getElementById("order-list");

  if (!order.length) {

    list.innerHTML =
      '<p class="empty">Todavía no agregaste ningún café.</p>';

    return;
  }


  const counts = {};

  order.forEach(function(name) {

    counts[name] = (counts[name] || 0) + 1;

  });


  list.innerHTML = Object.entries(counts)
    .map(function([name, quantity]) {

      return `
        <div class="order-item">
          <span>${name}</span>
          <strong>${quantity} × 250 g</strong>
        </div>
      `;

    })
    .join("");
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


  const counts = {};

  order.forEach(function(name) {

    counts[name] = (counts[name] || 0) + 1;

  });


  const details = Object.entries(counts)
    .map(function([name, quantity]) {

      return `${quantity} × ${name} (250 g)`;

    })
    .join("\n");


  const message =
    `Nuevo pedido Gecko Coffee\n\n` +
    `${details}\n\n` +
    `Nombre: ${document.getElementById("customer-name").value}\n` +
    `WhatsApp: ${document.getElementById("customer-phone").value}\n` +
    `Email: ${document.getElementById("customer-email").value}\n` +
    `Entrega: ${document.getElementById("customer-address").value}`;


  /*
    TEMPORARY WHATSAPP NUMBER

    We'll replace this with your real
    Gecko Coffee WhatsApp number later.
  */

  const whatsapp = "595000000000";


  window.open(
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,
    "_blank"
  );


  document.getElementById("order-message").textContent =
    "Tu pedido está listo para enviar por WhatsApp.";
}
