$(document).ready(function() {
    // Función para cargar los productos
    function cargarProductos() {
        $.ajax({
            url: '../php/cargarProductos.php', // Ruta al archivo PHP
            method: 'GET',
            dataType: 'json', // Esperamos respuesta en formato JSON
            success: function(data) {
                if (data.success) {
                    const productosWrap = $('.ProductosWrap'); // Contenedor donde se mostrarán los productos
                    productosWrap.empty(); // Limpiar el contenido previo

                    // Recorrer los productos y mostrarlos
                    data.productos.forEach(function(producto) {
                        const productoHTML = `
                            <section class="card">
                                <div class="targ-img">
                                    <img src="../src/product.png" alt="${producto.nombre}" class="img-fluid">
                                </div>
                                <div class="info">
                                    <h5>${producto.nombre}</h5>
                                    <p class="descripcion">${producto.descripcion}</p>
                                    <p class="precio">${producto.precio}€</p>
                                </div>
                                <div class="button">
                                    <button class="compra">BUY</button>
                                </div>
                            </section>
                        `;
                        productosWrap.append(productoHTML); // Agregar al contenedor
                    });
                } else {
                    alert('Error al cargar los productos: ' + data.error);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
                alert('Hubo un problema con la solicitud');
            }
        });
    }

    // Llamamos a la función para cargar los productos cuando la página esté lista
    cargarProductos();

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Función para actualizar la vista del carrito
    function actualizarCarrito() {
        let carritoLista = $(".listaCarrito");
        let totalCarrito = $(".upup p");
        carritoLista.empty();

        let total = 0;

        carrito.forEach((producto, index) => {
            total += producto.precio * producto.cantidad;

            let item = $(`
                <section class="conjun">
                    <section class="rigth">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </section>
                    <section class="left">
                        <section class="arriba">
                            <p>${producto.nombre}</p>
                            <p>${producto.precio.toFixed(2)}€</p>
                        </section>
                        <section class="abajo">
                            <section class="canti">
                                <i class='bx bx-minus' data-index="${index}"></i>
                                <p>${producto.cantidad}</p>
                                <i class='bx bx-plus' data-index="${index}"></i>
                            </section>
                            <section class="trash">
                                <i class='bx bx-trash' data-index="${index}"></i>
                            </section>
                        </section>
                    </section>
                </section>
            `);

            carritoLista.append(item);
        });

        totalCarrito.text(`${total.toFixed(2)}€`);
        agregarEventosCarrito();
    }

    // Función para agregar productos al carrito
    function agregarAlCarrito(producto) {
        let existe = carrito.find(item => item.id === producto.id);

        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    // Eventos para modificar cantidades o eliminar productos
    function agregarEventosCarrito() {
        $(".bx-plus").click(function () {
            let index = $(this).data("index");
            carrito[index].cantidad++;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarCarrito();
        });

        $(".bx-minus").click(function () {
            let index = $(this).data("index");
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
            } else {
                carrito.splice(index, 1);
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarCarrito();
        });

        $(".bx-trash").click(function () {
            let index = $(this).data("index");
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarCarrito();
        });
    }

    // Capturar los clics en los botones "BUY"
    $(".compra").click(function () {
        let tarjeta = $(this).closest(".card");

        let producto = {
            id: tarjeta.data("id"),
            nombre: tarjeta.find("h5").text(),
            descripcion: tarjeta.find(".descripcion").text(),
            precio: parseFloat(tarjeta.find(".precio").text()),
            imagen: tarjeta.find("img").attr("src")
        };

        agregarAlCarrito(producto);
        console.log(producto);
        
    });
    
    
    // Cargar el carrito al inicio
    actualizarCarrito();




});
