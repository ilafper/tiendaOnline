$(document).ready(function () {
    // Función para cargar los productos
    function cargarProductos() {
        $.ajax({
            url: '../php/cargarProductos.php', // Ruta al archivo PHP
            method: 'GET',
            dataType: 'json', // Esperamos respuesta en formato JSON
            success: function (data) {
                if (data.success) {
                    const productosWrap = $('.ProductosWrap'); // Contenedor donde se mostrarán los productos
                    productosWrap.empty(); // Limpiar el contenido previo

                    // Recorrer los productos y mostrarlos
                    data.productos.forEach(function (producto) {
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
                                    <button class="añadir">AÑADIR CARRITO</button>
                                </div>
                            </section>
                        `;
                        productosWrap.append(productoHTML); // Agregar al contenedor
                    });

                } else {
                    alert('Error al cargar los productos: ' + data.error);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
                alert('Hubo un problema con la solicitud');
            }
        });
    }

    cargarProductos();


    $(document).ready(function () {
        $(document).on("click", ".añadir", function () {
            // Obtener el contenedor del producto
            let card = $(this).closest(".card");
    
            // Extraer la información del producto
            let nombre = card.find("h5").text();
            let precio = card.find(".precio").text();
            let imgSrc = card.find("img").attr("src");
            const listaCarrito = $('.listaCarrito');
            // Definir cantidad inicial
            let cantidad = 1;
        
            // Crear el HTML del producto en el carrito
            let itemCarrito = `
            <section class="item-carrito d-flex">
                <section class="rigth">
                    <img src="${imgSrc}" alt="${nombre}" width="50">
                </section>
                <section class="left d-flex flex-column w-100">
                    <section class="arriba">
                        <p>${nombre}</p>
                        <p>${precio}</p>
                    </section>
                    <section class="abajo d-flex align-items-center gap-2">
                        <section class="canti d-flex align-items-center gap-2">
                            <i class='bx bx-minus'></i>
                            <input type="number" class="cantidad-input" value="1" min="1">
                            <i class='bx bx-plus'></i>
                        </section>
                        <section class="trash">
                            <i class='bx bx-trash'></i>
                        </section>
                    </section>
                </section>
            </section>
            `;
        
            // Agregar el producto al carrito
            listaCarrito.append(itemCarrito);
        });
        
        // Aumentar o disminuir la cantidad cuando se haga clic en los botones de +/- 
        $(document).on("click", ".bx-plus", function () {
            let cantidad = $(this).siblings("p.cantidad");
            let cantidadVal = parseInt(cantidad.text());
            cantidad.text(cantidadVal + 1); // Incrementa la cantidad
        });
        
        $(document).on("click", ".bx-minus", function () {
            let cantidad = $(this).siblings("p.cantidad");
            let cantidadVal = parseInt(cantidad.text());
            if (cantidadVal > 1) { // No permitir que la cantidad sea menor a 1
                cantidad.text(cantidadVal - 1); // Decrementa la cantidad
            }
        });
        
        // Eliminar producto del carrito
        $(document).on("click", ".bx-trash", function () {
            $(this).closest(".item-carrito").remove(); // Elimina el producto
        });
        
    });



});
