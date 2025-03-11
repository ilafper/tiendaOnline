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

        $db = $client->selectDatabase("kanva");
        $collection = $db->selectCollection("usuarios");

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
        <title>Kanban - Bienvenido</title>
        <link rel="stylesheet" href="../css/estilos.css">
    </head>
    <body>
        <header>
            <h1>Bienvenido, <?php echo htmlspecialchars($usuario_nombre); ?>!</h1>
            <a href="logout.php">Cerrar sesión</a>
        </header>

        <main>
            <h2>Tu tablero Kanban</h2>
            <!-- Aquí puedes incluir el contenido de tu index.html -->
            <div id="kanban-container">
                <p>Aquí irá el tablero de tareas...</p>
            </div>
        </main>
    </body>
    </html>
    <?php

} else {
    header("location:../html/login.html");
    exit;
}
?>
