document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    // Evento para expandir el menú cuando el mouse pasa sobre el menú
    sidebar.addEventListener('mouseover', function() {
        sidebar.classList.add('expanded');
        mainContent.classList.add('expanded');
    });

    // Evento para colapsar el menú cuando el mouse se aleja del menú
    sidebar.addEventListener('mouseout', function() {
        sidebar.classList.remove('expanded');
        mainContent.classList.remove('expanded');
    });

    // Configura el estado inicial del enlace de sesión
    checkSession();
});

let isAuthenticated = false;

function showSection(sectionId) {
    // Oculta todas las secciones
    document.querySelectorAll('.content.section').forEach(function(section) {
        section.classList.remove('active');
    });

    // Muestra la sección seleccionada
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.classList.add('active');
    }
}

function scheduleCall() {
    // Tu lógica para manejar la programación de una llamada
    alert('¡Pronto nos pondremos en contacto para programar tu llamada!'); // Placeholder alert
}

function handleRegistration(event) {
    event.preventDefault();  // Evita el envío inmediato del formulario

    // Simulación de un proceso de registro exitoso
    setTimeout(() => {
        alert("Registro exitoso");
        document.getElementById("registro").reset(); // Limpiar formulario

        // Redirigir a la página de inicio de sesión
        showSection('login');
    }, 1000);  // Espera 1 segundo antes de redirigir
}

function toggleLogin() {
    const loginLink = document.getElementById('session-link');
    if (isAuthenticated) {
        loginLink.innerHTML = 'Cerrar Sesión';
        loginLink.setAttribute('onclick', 'logout()');
        document.getElementById('registro-link').style.display = 'none';
        document.getElementById('login-link').style.display = 'none';
    } else {
        loginLink.innerHTML = 'Iniciar Sesión';
        loginLink.setAttribute('onclick', 'showSection(\'login\')');
        document.getElementById('registro-link').style.display = 'block';
        document.getElementById('login-link').style.display = 'block';
    }
}

function login() {
    // Aquí iría la lógica de inicio de sesión real (validación de usuario, etc.)
    isAuthenticated = true;
    toggleLogin();
    showSection('inicio'); // Muestra la sección de inicio después de iniciar sesión

    // Vaciar campos de correo y contraseña
    document.getElementById('email-login').value = '';
    document.getElementById('password-login').value = '';
}

function logout() {
    // Aquí iría la lógica de cierre de sesión real
    isAuthenticated = false;
    toggleLogin();
    showSection('inicio'); // Muestra la sección de inicio después de cerrar sesión
}

document.addEventListener('DOMContentLoaded', function() {
    checkSession();

    document.querySelectorAll('.menu a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(this.getAttribute('onclick').split("'")[1]);
        });
    });
});

function checkSession() {
    fetch('session_check.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById('login-link').style.display = 'none';
                document.querySelectorAll('.restricted').forEach(function(section) {
                    section.classList.remove('restricted');
                });
            } else {
                document.getElementById('login-link').style.display = 'block';
                document.querySelectorAll('.restricted').forEach(function(section) {
                    section.classList.add('restricted');
                });
            }
        });
}

function toggleService(serviceId) {
    // Obtén todos los detalles de servicios
    var serviceDetails = document.querySelectorAll('.service-details');

    // Oculta todas las descripciones de servicios
    serviceDetails.forEach(function(detail) {
        detail.style.display = 'none';
        detail.parentElement.classList.remove('active');
    });

    // Muestra los detalles del servicio seleccionado
    var selectedService = document.getElementById(serviceId);
    selectedService.style.display = 'block';
    selectedService.parentElement.classList.add('active');
}


function showInfo(element, infoText) {
    var infoBox = element.querySelector('.info-text');
    infoBox.textContent = infoText;
}



function toggleService(serviceId) {
    var serviceElement = document.getElementById(serviceId);
    if (serviceElement.style.display === "block") {
        serviceElement.style.display = "none";
    } else {
        serviceElement.style.display = "block";
    }
}



// Agregar esto al archivo script.js existente o actualizar si ya existe

document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminLogoutButton = document.getElementById('admin-logout');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const adminCode = document.getElementById('admin-code').value;
            loginAdmin(adminCode);
        });
    }

    if (adminLogoutButton) {
        adminLogoutButton.addEventListener('click', logoutAdmin);
    }
});

function loginAdmin(adminCode) {
    fetch('php/admin_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'admin_code=' + encodeURIComponent(adminCode)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-content').style.display = 'block';
        } else {
            alert('Código de acceso incorrecto. Por favor, intente de nuevo.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al procesar su solicitud. Por favor, intente de nuevo más tarde.');
    });
}

function logoutAdmin() {
    fetch('php/admin_logout.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('admin-login').style.display = 'block';
            document.getElementById('admin-content').style.display = 'none';
            document.getElementById('admin-code').value = ''; // Limpiar el campo de código
        } else {
            alert('Hubo un problema al cerrar la sesión. Por favor, intente de nuevo.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al procesar su solicitud. Por favor, intente de nuevo más tarde.');
    });
}






let currentTable = 'pasturas';

function showTab(table) {
    currentTable = table;
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(`${table}-tab`).style.display = 'block';
    loadTableData(table);
}

function loadTableData(table) {
    fetch('php/admin_crud.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=read&table=${table}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tableBody = document.querySelector(`#${table}-table tbody`);
            tableBody.innerHTML = '';
            data.data.forEach(item => {
                const row = document.createElement('tr');
                Object.values(item).forEach(value => {
                    const cell = document.createElement('td');
                    cell.textContent = value;
                    row.appendChild(cell);
                });
                const actionsCell = document.createElement('td');
                actionsCell.innerHTML = `
                    <button onclick="editItem('${table}', ${item.codigo_barras})">Editar</button>
                    <button onclick="deleteItem('${table}', ${item.codigo_barras})">Eliminar</button>
                `;
                row.appendChild(actionsCell);
                tableBody.appendChild(row);
            });
        } else {
            alert('Error al cargar los datos');
        }
    });
}

function showAddForm(table) {
    const form = document.getElementById('edit-form');
    form.innerHTML = '';
    form.style.display = 'block';

    const fields = getFields();
    fields.forEach(field => {
        if (field !== 'codigo_barras') {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = field;
            input.placeholder = field;
            form.appendChild(input);
        }
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Añadir';
    submitButton.onclick = () => createItem(table);
    form.appendChild(submitButton);
}
function editItem(table, codigo_barras) {
    fetch('php/admin_crud.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=read&table=${table}&codigo_barras=${codigo_barras}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const item = data.data;
            const form = document.getElementById('edit-form');
            form.innerHTML = '';
            form.style.display = 'block';

            Object.entries(item).forEach(([key, value]) => {
                if (key !== 'codigo_barras') {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                }
            });

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Actualizar';
            submitButton.onclick = () => updateItem(table, codigo_barras);
            form.appendChild(submitButton);
        } else {
            alert('Error al cargar los datos');
        }
    });
}

function createItem(table) {
    const form = document.getElementById('edit-form');
    const data = {};
    form.querySelectorAll('input').forEach(input => {
        data[input.name] = input.value;
    });

    console.log('Enviando datos:', data);  // Log de los datos que se están enviando

    fetch('php/admin_crud.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=create&table=${table}&data=${JSON.stringify(data)}`
    })
    .then(response => {
        console.log('Respuesta del servidor:', response);  // Log de la respuesta completa del servidor
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data);  // Log de los datos recibidos
        if (data.success) {
            alert('Ítem creado con éxito');
            form.style.display = 'none';
            loadTableData(table);
        } else {
            alert('Error al crear el ítem: ' + (data.message || 'Error desconocido'));
        }
    })
    .catch(error => {
        console.error('Error detallado:', error);  // Log detallado del error
        alert('Error al procesar la solicitud: ' + error.message);
    });
}

function updateItem(table, codigo_barras) {
    const form = document.getElementById('edit-form');
    const data = {};
    form.querySelectorAll('input').forEach(input => {
        data[input.name] = input.value;
    });

    fetch('php/admin_crud.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=update&table=${table}&codigo_barras=${codigo_barras}&data=${JSON.stringify(data)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Ítem actualizado con éxito');
            form.style.display = 'none';
            loadTableData(table);
        } else {
            alert('Error al actualizar el ítem: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la solicitud');
    });
}

function deleteItem(table, codigo_barras) {
    if (confirm('¿Estás seguro de que quieres eliminar este ítem?')) {
        fetch('php/admin_crud.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=delete&table=${table}&codigo_barras=${codigo_barras}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Ítem eliminado con éxito');
                loadTableData(table);
            } else {
                alert('Error al eliminar el ítem');
            }
        });
    }
}

function getFields() {
    return ['codigo_barras', 'producto', 'precio', 'existencia'];
}

// Asegúrate de que esta función se llame cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    showTab('pasturas');  // Carga la pestaña de pasturas por defecto
});







// Función para cargar los datos del dashboard
function loadDashboardData() {
    fetch('http://localhost:3000/Mi%20Proyecto/php/dashboard-data.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data); // Para depuración

        updateDashboardUI(data);
        createProductsChart(data.products_by_category);
        createStockChart(data.stock_by_category);
    })
    .catch(error => {
        console.error('Error:', error);
        displayErrorMessage('Error al cargar los datos del dashboard');
    });
}

function updateDashboardUI(data) {
    document.getElementById('total-users').textContent = data.total_users;
    document.getElementById('total-products').textContent = calculateTotalProducts(data.products_by_category);
    document.getElementById('total-inventory-value').textContent = formatCurrency(data.total_inventory_value);
    document.getElementById('top-product').textContent = findTopProduct(data.top_products);
}

function calculateTotalProducts(productsByCategory) {
    return Object.values(productsByCategory).reduce((total, count) => total + count, 0);
}

function formatCurrency(value) {
    return `$${parseFloat(value).toFixed(2)}`;
}

function findTopProduct(topProducts) {
    console.log('Top Products:', topProducts); // Para depuración

    if (!topProducts || typeof topProducts !== 'object') {
        console.error('Invalid topProducts data:', topProducts);
        return 'No disponible';
    }

    let maxPrice = -1;
    let topProduct = '';

    for (const category in topProducts) {
        if (topProducts.hasOwnProperty(category)) {
            const product = topProducts[category];
            console.log(`Category: ${category}, Product:`, product); // Para depuración

            if (product && typeof product.price === 'number' && product.price > maxPrice) {
                maxPrice = product.price;
                topProduct = product.product;
            }
        }
    }

    if (maxPrice === -1 || !topProduct) {
        console.warn('No valid top product found');
        return 'No disponible';
    }

    return `${topProduct} (${formatCurrency(maxPrice)})`;
}

// Asegúrate de que esta función esté definida
function formatCurrency(value) {
    return `$${parseFloat(value).toFixed(2)}`;
}

// Función para crear un gráfico de barras
function createBarChart(data, elementId, title) {
    const margin = {top: 30, right: 30, bottom: 70, left: 60};
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Limpiar el contenido existente
    d3.select(`#${elementId}`).html("");

    const svg = d3.select(`#${elementId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Añadir título
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.category))
        .padding(0.2);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#69b3a2");
}

// Cargar datos del dashboard cuando se muestra la sección
document.addEventListener('DOMContentLoaded', () => {
    const dashboardSection = document.getElementById('dashboard');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (dashboardSection.classList.contains('active')) {
                    loadDashboardData();
                }
            }
        });
    });
    observer.observe(dashboardSection, { attributes: true });
});

function loadDashboardData() {
    fetch('http://localhost:3000/Mi%20Proyecto/php/dashboard-data.php')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Verificar los datos en la consola

            // Actualización de la UI con validaciones
            document.getElementById('total-users').textContent = data.total_users;
            document.getElementById('total-products').textContent = data.total_pasturas + data.total_ordeño + data.total_riego + data.total_cercado;
            document.getElementById('total-inventory-value').textContent = `$${data.total_inventory_value ? data.total_inventory_value.toFixed(2) : '0.00'}`;

            // Encontrar el producto más caro de todas las categorías
            const topProduct = ['pasturas', 'ordeño', 'riego', 'cercado'].reduce((a, b) => {
                return (data[`top_${a}_price`] > data[`top_${b}_price`] ? a : b);
            });

            // Validar que los datos existan antes de mostrarlos
            const topProductName = data[`top_${topProduct}_product`] || 'N/A';
            const topProductPrice = data[`top_${topProduct}_price`] ? `$${data[`top_${topProduct}_price`]}` : '$0.00';
            
            document.getElementById('top-product').textContent = `${topProductName} (${topProductPrice})`;

            // Crear gráficos
            createBarChart([
                { category: 'Pasturas', value: data.total_pasturas },
                { category: 'Ordeño', value: data.total_ordeño },
                { category: 'Riego', value: data.total_riego },
                { category: 'Cercado', value: data.total_cercado }
            ], 'products-chart', 'Productos por Categoría');
            
            createBarChart([
                { category: 'Pasturas', value: data.total_stock_pasturas },
                { category: 'Ordeño', value: data.total_stock_ordeño },
                { category: 'Riego', value: data.total_stock_riego },
                { category: 'Cercado', value: data.total_stock_cercado }
            ], 'stock-chart', 'Existencias por Categoría');
        })
        .catch(error => console.error('Error:', error));
}







window.onload = function() {
    (function(d, script) {
        script = d.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://w.app/widget-v1/VWKzpF.js';
        d.getElementsByTagName('head')[0].appendChild(script);
        }(document));
};









function scheduleCall() {
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("callForm").reset();
    document.getElementById("thank-you-message").style.display = "none";
}

document.getElementById("callForm").onsubmit = function(event) {
    event.preventDefault(); // Evitar que la página se recargue
    document.getElementById("thank-you-message").style.display = "block";
    document.getElementById("callForm").style.display = "none";
}