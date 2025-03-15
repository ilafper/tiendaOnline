<?php
session_start();
require('../vendor/autoload.php');

// Asegurarse de que la solicitud es POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "mensaje" => "Método no permitido"]);
    exit;
}

// Obtener el carrito enviado desde el cliente
if (!isset($_POST['carrito'])) {
    echo json_encode(["success" => false, "mensaje" => "No se recibió el carrito"]);
    exit;
}

$carrito = $_POST['carrito']; // Recibimos el carrito como array

try {
    $uri = 'mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos';
    $client = new MongoDB\Client($uri);
    $db = $client->selectDatabase("Tienda");
    $productosCollection = $db->selectCollection("productos");

    // Procesar cada producto en el carrito
    foreach ($carrito as $item) {
        $codigo = $item["codigo"];
        $cantidad = $item["cantidad"];

        // Buscar el producto en la base de datos
        $producto = $productosCollection->findOne(["codigo" => $codigo]);

        if (!$producto) {
            echo json_encode(["success" => false, "mensaje" => "Producto no encontrado: $codigo"]);
            exit;
        }

        // Comprobar si hay suficiente stock
        if ($producto["cantidad_stock"] < $cantidad) {
            echo json_encode(["success" => false, "mensaje" => "Stock insuficiente para el producto: $codigo"]);
            exit;
        }

        // Restar la cantidad del stock (corrigiendo la sintaxis)
        $productosCollection->updateOne(
            ["codigo" => $codigo],
            //operador de mongoDB PARA INCREMENTAR O DISMINUIR
            ['$inc' => ["cantidad_stock" => -$cantidad]]  // Decrementar el stock correctamente
        );
    }

    echo json_encode(["success" => true, "mensaje" => "Pedido realizado con éxito"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "mensaje" => "Error del servidor: " . $e->getMessage()]);
}
?>
