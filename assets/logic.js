document.getElementById("year").textContent = new Date().getFullYear();
const modal_pedido = document.getElementById("modal-pedido")

const productos = [
  {
    id: "001",
    nombre: "PRESA DE POLLO (MUSLO)",
    precio: 5000,
    imagen: "assets/images/muslo.jpeg",
    cant: 1
  },
  {
    id: "002",
    nombre: "PRESA DE POLLO (CONTRAMUSLO)",
    precio: 5000,
    imagen: "assets/images/contramuslo.jpeg",
    cant: 1
  },
  {
    id: "003",
    nombre: "PRESA DE POLLO (ALA)",
    precio: 4000,
    imagen: "assets/images/ala.jpeg",
    cant: 1
  }
];

const overlay = document.getElementById("overlay");
const btnMenu = document.getElementById("btn_menu");
const menuPrincipal = document.getElementById("menuprincipal");

btnMenu.addEventListener("click", abrirMenu);
overlay.addEventListener("click", () =>{
    cerrarMenu()
    cerrarCarrito()
    modal_pedido.style.display = "none"
});

document.getElementById("btn-cancelar-pedido").addEventListener("click", cerrarModal)

document.querySelectorAll("#menuprincipal a").forEach(link => {
    link.addEventListener("click", cerrarMenu);
});

function abrirMenu() {
    cerrarCarrito()
    menuPrincipal.style.display = "flex";
    menuPrincipal.classList.add("abriendo");
    setTimeout(() => {
        menuPrincipal.classList.remove("abriendo");
        overlay.style.display = "block";
    }, 400);
}

function cerrarMenu() {
    menuPrincipal.classList.add("cerrando");
    overlay.style.display = "none";
    setTimeout(() => {
        menuPrincipal.style.display = "none";
        menuPrincipal.classList.remove("cerrando");
    }, 400);
}

function cerrarModal(){
    modal_pedido.classList.remove("active");
    setTimeout(() => {
        modal_pedido.style.display = "none"
        overlay.style.display = "none"
    }, 300);
}

function renderProds(){
    const contenedor = document.getElementById("opcionesmenu")
    productos.forEach(prod => {
    contenedor.innerHTML += `
        <div class="tarjetaprod">
        <div class="imgprod">
            <img src="${prod.imagen}" alt="${prod.nombre}">
        </div>
        <div class="infoprod">
            <h3>${prod.nombre}</h3>
            <h4>$${prod.precio.toLocaleString("es-CO")}</h4>
            <button class="btn-pedir-ahora" data-idprod="${prod.id}">Pedir Ahora</button>
            <button class="btn-add-car" data-idprod="${prod.id}">Agregar al Carrito</button>
        </div>
        </div>
    `;
    });
}

let carrito;

// =============================================
// PEDIDO: estado centralizado para el modal
// =============================================
let pedidoItems = []; // [{ id, cant }]
let pedidoOrigen = ""; // "directo" | "carrito"

function calcularTotalPedido() {
    return pedidoItems.reduce((acc, item) => {
        const prod = productos.find(p => p.id === item.id);
        return acc + prod.precio * item.cant;
    }, 0);
}

function renderPedidoModal() {
    const divpedido = document.getElementById("pedido");
    divpedido.innerHTML = "";

    pedidoItems.forEach(item => {
        const prod = productos.find(p => p.id === item.id);

        const el = document.createElement("div");
        el.classList.add("item-carrito");
        el.innerHTML = `
            <div class="item-info">
                <h4>${prod.nombre}</h4>
                <span>$${(prod.precio * item.cant).toLocaleString("es-CO")}</span>
            </div>
            <div class="cantidad-control">
                <button class="btn-restar-pedido" data-id="${item.id}">-</button>
                <span class="cantidad-pedido">${item.cant}</span>
                <button class="btn-sumar-pedido" data-id="${item.id}">+</button>
            </div>
            <button class="btn-eliminar-pedido" data-id="${item.id}">🗑</button>
        `;
        divpedido.appendChild(el);
    });

    document.getElementById("totalPedido").textContent =
        "$" + calcularTotalPedido().toLocaleString("es-CO");

    // Eventos de cantidad y eliminar dentro del modal pedido
    divpedido.querySelectorAll(".btn-sumar-pedido").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = pedidoItems.find(p => p.id === btn.dataset.id);
            if (item) { item.cant++; renderPedidoModal(); }
        });
    });

    divpedido.querySelectorAll(".btn-restar-pedido").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = pedidoItems.find(p => p.id === btn.dataset.id);
            if (item) {
                if (item.cant > 1) {
                    item.cant--;
                } else {
                    pedidoItems = pedidoItems.filter(p => p.id !== btn.dataset.id);
                }
                renderPedidoModal();
            }
        });
    });

    divpedido.querySelectorAll(".btn-eliminar-pedido").forEach(btn => {
        btn.addEventListener("click", () => {
            pedidoItems = pedidoItems.filter(p => p.id !== btn.dataset.id);
            renderPedidoModal();
        });
    });
}

function abrirModalPedido() {
    overlay.style.display = "block";
    modal_pedido.style.display = "flex";
    setTimeout(() => {
        modal_pedido.classList.add("active");
    }, 10);
    renderPedidoModal();
}

document.addEventListener("DOMContentLoaded", () => {

    renderProds()

    const botones_pedido = document.querySelectorAll(".btn-pedir-ahora")
    botones_pedido.forEach(b => {
        b.addEventListener("click", () => {
            const idProd = b.dataset.idprod;
            pedidoOrigen = "directo";
            pedidoItems = [{ id: idProd, cant: 1 }];
            abrirModalPedido();
        });
    });

    carrito = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []

    const botonesAgregar = document.querySelectorAll(".btn-add-car");
    botonesAgregar.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.idprod;
            const existe = carrito.find(p => p.id === id);
            if(existe){
                existe.cant += 1;
            } else {
                carrito.push({ id: id, cant: 1 });
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
        });
    });

})

const opcionesPedido = document.querySelectorAll('[name="opcion-pedido"]');
opcionesPedido.forEach(o => {
    o.addEventListener("change", ()=> {
        if(o.checked){
            if(o.id === "domicilio") {
                document.getElementById("direccionInput").style.display = "flex"
            } else {
                document.getElementById("direccionInput").style.display = "none"
            }
        }
    })
})

document.getElementById("btn-carrito").addEventListener("click", (e) => {
    e.preventDefault()
    abrirCarrito();
    renderCarrito();
});

document.getElementById("btn-carrito-mobile").addEventListener("click", () => {
    abrirCarrito();
    renderCarrito();
});

const modalCarrito = document.getElementById("modal-carrito");

function abrirCarrito() {
    overlay.style.display = "block";
    modalCarrito.style.display = "flex";
    setTimeout(() => {
        modalCarrito.classList.add("active");
    }, 10);
}

function cerrarCarrito() {
    modalCarrito.classList.remove("active");
    setTimeout(() => {
        modalCarrito.style.display = "none";
        overlay.style.display = "none";
    }, 300);
}

function renderCarrito(){
    const contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";

    if(carrito.length === 0){
        contenedor.innerHTML = `<p>No hay productos en el carrito</p>`;
        return;
    }

    let compra = 0;

    carrito.forEach(p => {
        const prod = productos.find(e => e.id === p.id);
        const total = prod.precio * p.cant;
        compra += total

        contenedor.innerHTML += `
            <div class="item-carrito">
                <div class="item-info">
                    <h4>${prod.nombre}</h4>
                    <span>$${total.toLocaleString("es-CO")}</span>
                </div>
                <div class="cantidad-control">
                    <button data-id="${p.id}" class="btn-restar">-</button>
                    <span>${p.cant}</span>
                    <button data-id="${p.id}" class="btn-sumar">+</button>
                </div>
                <button data-id="${p.id}" class="btn-eliminar">🗑</button>
            </div>
        `;
    });

    contenedor.innerHTML += `<div><h3>Total: $${compra.toLocaleString("es-CO")}</h3></div>`

    activarEventosCarrito();
}

function activarEventosCarrito(){
    document.querySelectorAll(".btn-sumar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const prod = carrito.find(p => p.id === id);
            prod.cant += 1;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderCarrito();
        });
    });

    document.querySelectorAll(".btn-restar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const prod = carrito.find(p => p.id === id);
            if(prod.cant > 1){
                prod.cant -= 1;
            } else {
                carrito = carrito.filter(p => p.id !== id);
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderCarrito();
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            carrito = carrito.filter(p => p.id !== id);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderCarrito();
        });
    });
}

document.getElementById("btn-cerrar-carrito").addEventListener("click", cerrarCarrito);

document.getElementById("btn-pedir-carrito").addEventListener("click", ()=> {
    if(carrito.length === 0) return;
    cerrarCarrito();
    setTimeout(() => {
        pedidoOrigen = "carrito";
        // Copiamos el carrito en pedidoItems para poder editar independientemente
        pedidoItems = carrito.map(e => ({ id: e.id, cant: e.cant }));
        abrirModalPedido();
    }, 400);
})

document.getElementById("btn-pedir").addEventListener("click", ()=> {
    if(pedidoItems.length === 0){
        alert("No hay productos en el pedido.");
        return;
    }

    const esDomicilio = document.getElementById("domicilio").checked;
    const direccionInput = document.getElementById("direccionPedido");
    const metodoPago = document.querySelector('[name="metodo-pago"]:checked').parentElement.textContent.trim();

    if(esDomicilio && direccionInput.value.trim() === ""){
        alert("Por favor ingresa la dirección para el domicilio.");
        return;
    }

    let mensaje = "🍗 *LA ESQUINA DEL POLLO* 🍗\n\n";
    mensaje += "🧾 *Pedido:*\n";

    let total = 0;
    pedidoItems.forEach(item => {
        const prod = productos.find(p => p.id === item.id);
        const subtotal = prod.precio * item.cant;
        total += subtotal;
        mensaje += `• ${prod.nombre} x ${item.cant} = $${subtotal.toLocaleString("es-CO")}\n`;
    });

    mensaje += "\n💰 *Total:* $" + total.toLocaleString("es-CO") + "\n";
    mensaje += "\n🚚 *Tipo de pedido:* ";
    mensaje += esDomicilio ? "Domicilio\n" : "Recoger en tienda\n";

    if(esDomicilio){
        mensaje += "📍 *Dirección:* " + direccionInput.value.trim() + "\n";
    }

    mensaje += "\n💳 *Método de pago:* " + metodoPago;

    const numero = "573217013712";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    // Limpiar
    carrito = [];
    localStorage.removeItem("carrito");
    pedidoItems = [];

    document.getElementById("pedido").innerHTML = "";
    document.getElementById("totalPedido").textContent = "";
    direccionInput.value = "";

    cerrarModal();
});
