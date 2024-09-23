<?php
session_start();
header('Content-Type: application/json');

$response = array('loggedIn' => isset($_SESSION['loggedin']) && $_SESSION['loggedin']);
echo json_encode($response);
?>
