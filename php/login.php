<?php
session_start();
require('../vendor/autoload.php');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = $_POST["username"] ?? null;
    $contra = $_POST["password"] ?? null;

    if (empty($usuario) || empty($contra)) {
        header("location:../html/login.html");
        exit;
    }

    try {
        $uri = 'mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos';
        $client = new MongoDB\Client($uri);

        $db = $client->selectDatabase("Tienda");
        $collection = $db->selectCollection("login");

        $encontrado = $collection->findOne(["nombre" => $usuario]);

        if ($encontrado && $contra === $encontrado["password"]) {
            // Guardar el ID del usuario en la sesión
            $_SESSION["usuario_id"] = (string) $encontrado["_id"];  // Convertir el ObjectId a string
            $_SESSION["usuario_nombre"] = $encontrado["nombre"];
            $_SESSION["rol"] = $encontrado["rol"];
        } else {
            header("location:../html/login.html");
            exit;
        }
    } catch (Exception $error) {
        http_response_code(500);
        echo "Error del servidor: " . $error->getMessage();
        exit;
    }
}

// Si el usuario ha iniciado sesión, mostrar el contenido de index.html con datos dinámicos
if (isset($_SESSION["usuario_id"])) {
    $usuario_nombre = $_SESSION["usuario_nombre"];
    $rol = $_SESSION["rol"];
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css">
        <link rel="stylesheet" href="../css/styles.css">
    </head>
    <body>
    <nav class="navbar navbar-expand-md navbar-light bg-light shadow-sm">
        <div class="container-fluid">
            <!-- Logo -->
            <section class="logo">
                <a class="navbar-brand" href="login.php">
                    <img src="../src/figura.png" alt="Logo del grupo" width="100" class="logito">
                </a>
            </section>

            <!-- Botón de colapso para móviles -->
            <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Enlaces -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto d-flex justify-content-end align-items-center w-100 gap-4">
                    <li class="nav-item">
                        <button class="bx bx-user icono-usuario"></button>
                        <span><?php echo htmlspecialchars($usuario_nombre); ?></span>
                    </li>
                    <li class="nav-item">
                        <a class="cerrar" href="cerrar.php">Cerrar sesión</a>
                    </li>
                    <li class="nav-item">
                        <button id="open-cart-btn" class="nav-link" aria-label="Ver carrito">
                            <a href="#carrito"><i class="bx bx-cart"></i></a>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <section class="ProductosWrap">

    </section>

    <footer>
        <h4>&copy; 2025 VIVE MARK. Todos los derechos reservados.</h4>
        <section class="redes">
            <a href="https://www.facebook.com" target="_blank"><i class="bx bxl-facebook"></i></a>
            <a href="https://www.twitter.com" target="_blank"><i class="bx bxl-twitter"></i></a>
            <a href="https://www.instagram.com" target="_blank"><i class="bx bxl-instagram"></i></a>
            <a href="https://www.youtube.com" target="_blank"><i class="bx bxl-youtube"></i></a>
        </section>
    </footer>



    <section id="carrito" class="carrito">
        <section class="titi">
            <h3>TU CARRITO</h3>
            <a href="#"><i class='bx bx-x'></i></a>
        </section>
        <section class="subtiti">
            <h4>Producto</h4>
            <h4>Total</h4>
        </section>

        <section class="listaCarrito">
            <section class="fin">
                <section class="upup">
                    <h3>TOTAL</h3>
                    <P>12.99€</P>
                </section>
                <section>
                    <button>REALIZAR PEDIDO</button>
                </section>
            </section>
        </section>
    </section>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../js/app.js"></script>
    </body>
    </html>
    <?php

} else {
    header("location:../html/login.html");
    exit;
}
?>
