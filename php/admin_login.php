<?php
// Guardar como php/admin_login.php

header('Content-Type: application/json');

// Conectar a la base de datos
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "mi_base_datos"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Obtener el código de acceso enviado
$admin_code = $_POST['admin_code'];

// Preparar la consulta SQL
$stmt = $conn->prepare("SELECT codigo_acceso FROM admin WHERE codigo_acceso = ?");
$stmt->bind_param("s", $admin_code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}

$stmt->close();
$conn->close();
?>

