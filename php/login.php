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

// Procesamiento del formulario de inicio de sesión
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitización y validación del correo electrónico
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Correo electrónico no válido.";
        exit;
    }

    // Sanitización y validación de la contraseña
    $password = $_POST['password'];
    if (!preg_match('/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,12}$/', $password)) {
        echo "La contraseña debe tener entre 7 y 12 caracteres, incluir al menos una letra mayúscula y un número.";
        exit;
    }

    // Buscar el usuario por correo electrónico
    try {
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verificar la contraseña
        if ($user && password_verify($password, $user['password'])) {
            // Iniciar sesión del usuario
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = htmlspecialchars($user['nombre']);
            $_SESSION['lastname'] = htmlspecialchars($user['apellido']);
            
            // Redirigir al usuario al inicio de la página
            header("Location: /"); // Cambia esta URL según la estructura de tu aplicación
            exit;
        } else {
            echo "Correo o contraseña incorrectos.";
        }
    } catch(PDOException $e) {
        echo "Error al consultar la base de datos: " . $e->getMessage();
    }
}
?>
