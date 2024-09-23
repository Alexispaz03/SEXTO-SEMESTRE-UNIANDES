<?php
// Guardar como php/admin_logout.php

header('Content-Type: application/json');

// Aquí podrías realizar cualquier limpieza de sesión necesaria
// Por ejemplo, si estás usando sesiones de PHP:
// session_start();
// session_destroy();

// Simplemente devolvemos un éxito, ya que la lógica principal se maneja en el cliente
echo json_encode(['success' => true]);
?>