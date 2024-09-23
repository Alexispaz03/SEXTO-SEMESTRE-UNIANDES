<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "mi_base_datos"; 

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Conexión fallida: ' . $e->getMessage()]));
}

function getDashboardData() {
    global $pdo;
    $data = array();

    // Total de usuarios registrados
    $sql = "SELECT COUNT(*) as total_users FROM usuarios";
    $stmt = $pdo->query($sql);
    $data['total_users'] = $stmt->fetchColumn();

    // Total de productos por categoría
    $categories = ['pasturas', 'ordeño', 'riego', 'cercado'];
    foreach ($categories as $category) {
        $sql = "SELECT COUNT(*) as total FROM `$category`";
        $stmt = $pdo->query($sql);
        $data["total_$category"] = $stmt->fetchColumn();
    }

    // Producto más caro por categoría
    $categories = ['pasturas', 'ordeño', 'riego', 'cercado'];
    foreach ($categories as $category) {
        $sql = "SELECT Producto, Precio FROM `$category` ORDER BY Precio DESC LIMIT 1";
        $stmt = $pdo->query($sql);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $data["top_{$category}_product"] = $row['Producto'];
            $data["top_{$category}_price"] = floatval($row['Precio']);
        } else {
            $data["top_{$category}_product"] = 'N/A';
            $data["top_{$category}_price"] = 0;
        }
    }

    // Total de existencias por categoría
    foreach ($categories as $category) {
        $sql = "SELECT SUM(Existencia) as total_stock FROM `$category`";
        $stmt = $pdo->query($sql);
        $data["total_stock_$category"] = floatval($stmt->fetchColumn());
    }

    // Valor total del inventario
    $sql = "SELECT SUM(Precio * Existencia) as total_value FROM (
        SELECT Precio, Existencia FROM pasturas
        UNION ALL
        SELECT Precio, Existencia FROM `ordeño`
        UNION ALL
        SELECT Precio, Existencia FROM riego
        UNION ALL
        SELECT Precio, Existencia FROM cercado
    ) as all_products";
    $stmt = $pdo->query($sql);
    $data['total_inventory_value'] = floatval($stmt->fetchColumn());

    return $data;
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $dashboardData = getDashboardData();
        error_log('Dashboard Data: ' . print_r($dashboardData, true)); // Para depuración
        echo json_encode($dashboardData);
    } else {
        throw new Exception('Invalid request method');
    }
} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
}
?>