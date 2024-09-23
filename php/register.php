<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "mi_base_datos"; 

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Procesamiento del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitización de entradas
    $first_name = htmlspecialchars($_POST['first-name']);
    $last_name = htmlspecialchars($_POST['last-name']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars($_POST['phone']);
    $password = $_POST['password'];

    // Validación
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Correo electrónico no válido.";
        exit;
    }

    if (!preg_match('/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,12}$/', $password)) {
        echo "La contraseña debe tener entre 7 y 12 caracteres, incluir al menos una letra mayúscula y un número.";
        exit;
    }

    // Hash de la contraseña
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insertar datos en la base de datos
    try {
        $stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, email, telefono, password) 
                                VALUES (:nombre, :apellido, :email, :telefono, :password)");
        $stmt->bindParam(':nombre', $first_name);
        $stmt->bindParam(':apellido', $last_name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':telefono', $phone);
        $stmt->bindParam(':password', $hashed_password);

        $stmt->execute();
        echo "Registro exitoso.";
        // Redirecciona después de 1 segundo
        echo '<script>
                setTimeout(function() {
                    window.location.href = "../index.html"; // Cambia esta ruta según tu estructura
                }, 1000);
              </script>';
    } catch (PDOException $e) {
        echo "Error al registrar: " . $e->getMessage();
    }
}
?>
