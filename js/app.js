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


                    // Recorrer los productos y mostrarlos.
                    data.productos.forEach(function (producto) {
                        const productoHTML = `
                            <section class="card" data-codigo="${producto.codigo}">
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
                        
                       //console.log(producto);
                       
                    });

                } else {
                    alert('Error al cargar los productos: ' + data.error);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
                
            }
        });
    }

    cargarProductos();
    function cargarCarrito() {
        $.ajax({
            url: '../php/cargarCarrito.php', // Ruta al archivo PHP para cargar el carrito
            method: 'GET',
            dataType: 'json', // Esperamos respuesta en formato JSON
            success: function (data) {
                if (data.success) {
                    const listaCarrito = $('.listaCarrito'); // Contenedor donde se mostrarán los productos del carrito
                    listaCarrito.empty(); // Limpiar el contenido previo del carrito
    
                    // Recorrer los productos del carrito y mostrarlos
                    data.productos.forEach(function (producto) {
                        const carritoHtml = `
                            <section class="item-carrito d-flex" data-codigo="${producto.codigo}">
                                <section class="rigth">
                                    <img src="../src/product.png" alt="${producto.nombre}" width="50">
                                </section>
                                <section class="left d-flex flex-column w-100">
                                    <section class="arriba">
                                        <p>${producto.nombre}</p>
                                        <p>${producto.precio}€</p>
                                    </section>
                                    <section class="abajo d-flex align-items-center gap-2">
                                        <section class="canti d-flex align-items-center gap-2">
                                            <i class='bx bx-minus'></i>
                                            <input type="number" class="cantidad-input" value="${producto.cantidad}" min="1">
                                            <i class='bx bx-plus'></i>
                                        </section>
                                        <section class="trash">
                                            <i class='bx bx-trash'></i>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        `;
                        listaCarrito.append(carritoHtml); // Agregar al contenedor
                    });
    
                } else {
                    alert('Error al cargar el carrito: ' + data.error);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
            }
        });
    }
    
    cargarCarrito();
    
    function calcularTotal() {
        let total = 0;
        $('.item-carrito').each(function () {
            let cantidad = parseInt($(this).find('.cantidad-input').val());
            let precio = parseFloat($(this).find('.arriba p:nth-child(2)').text().trim().replace('€', ''));
            total += cantidad * precio;
        });

        // Mostrar el total en el contenedor adecuado
        $('.total').text(total.toFixed(2) + '€');
    }
    calcularTotal();
    $(document).ready(function () {
        $(document).on("click", ".añadir", function () {
            let card = $(this).closest(".card");
            let productId = card.data("codigo");
            let nombre = card.find("h5").text();
            let precio = card.find(".precio").text().replace().trim();
            let imgSrc = card.find("img").attr("src");
            
            // Verificar si ya está en el carrito
            let itemExistente = $(".listaCarrito").find(`[data-codigo="${productId}"]`);
        
            if (itemExistente.length > 0) {
                // Si el producto ya está en el carrito, aumentar la cantidad en la base de datos
                let cantidadInput = itemExistente.find(".cantidad-input");
                let nuevaCantidad = parseInt(cantidadInput.val()) + 1;
                cantidadInput.val(nuevaCantidad);
        
                $.ajax({
                    url: '../php/actualizarCarrito.php',
                    method: 'POST',
                    data: {
                        codigo: productId,
                        cantidad: nuevaCantidad
                    },
                    success: function (response) {
                        console.log(response);
                        calcularTotal()
                    },
                    error: function (xhr, status, error) {
                        console.error("Error al actualizar la cantidad:", error);
                    }
                });
            } else {
                // Si es un nuevo producto, lo agregamos al carrito y a la base de datos
                let itemCarrito = `
                    <section class="item-carrito d-flex" data-codigo="${productId}">
                        <section class="rigth">
                            <img src="${imgSrc}" alt="${nombre}" width="50">
                        </section>
                        <section class="left d-flex flex-column w-100">
                            <section class="arriba">
                                <p>${nombre}</p>
                                <p>${precio}€</p>  
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
        
                $(".listaCarrito").append(itemCarrito);
                
                $.ajax({
                    url: '../php/actualizarCarrito.php',
                    method: 'POST',
                    data: {
                        codigo: productId,
                        nombre: nombre,
                        precio: precio, 
                        cantidad: 1,
                    },
                    success: function (response) {
                        console.log(response);
                        calcularTotal()
                    },
                    error: function (xhr, status, error) {
                        console.error("Error al agregar el producto:", error);
                    }
                });
            }
        });
    
        // Aumentar cantidad
        $(document).on("click", ".bx-plus", function () {
            let cantidadInput = $(this).siblings(".cantidad-input");
            let nuevaCantidad = parseInt(cantidadInput.val()) + 1; // Aumenta en 1
            cantidadInput.val(nuevaCantidad);
            let productId = $(this).closest(".item-carrito").data("codigo"); // Asegúrate de que se obtiene bien el ID
            let precio = $(this).closest(".item-carrito").find(".arriba p:nth-child(2)").text().trim();  // Obtener el precio del carrito
    
            $.ajax({
                url: '../php/actualizarCarrito.php',
                method: 'POST',
                data: { 
                    codigo: productId, 
                    precio: precio,  // Asegúrate de enviar el precio tal cual
                    cantidad: nuevaCantidad  // Solo enviamos la cantidad nueva
                },
                success: function (response) {
                    calcularTotal()
                }
            });
        });
    
        // Disminuir cantidad
        $(document).on("click", ".bx-minus", function () {
            let cantidadInput = $(this).siblings(".cantidad-input");
            let nuevaCantidad = Math.max(1, parseInt(cantidadInput.val()) - 1); // No permite valores menores a 1
            cantidadInput.val(nuevaCantidad);
            let productId = $(this).closest(".item-carrito").data("codigo");
        
            $.ajax({
                url: '../php/actualizarCarrito.php',
                method: 'POST',
                data: { 
                    codigo: productId, 
                    cantidad: nuevaCantidad // Enviamos la cantidad nueva sin calcular en el backend
                },
                success: function (response) {
                    calcularTotal()
                }
            });
        });
        
        
        $(document).on("click", ".bx-trash", function () {
            let item = $(this).closest(".item-carrito");
            let productId = item.data("codigo");
        
            $.ajax({
                url: '../php/eliminarProduct.php',
                method: 'POST',
                data: { codigo: productId },
                success: function (response) {
                    console.log(response);
                    item.remove();
                }
            });
        });
    });



});
