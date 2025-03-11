<?php
session_start();  // Inicia la sesión
// Eliminar todas las variables de sesión
session_unset();
// Destruir la sesión
session_destroy();
// Redirigir al usuario a la página de inicio o login
header("Location: ../html/login.html");  // Puedes cambiar "login.php" por cualquier otra página
exit();
?>
