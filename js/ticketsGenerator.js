// Seleccionar el botón de agregar fila y el cuerpo de la tabla
const addRowBtn = document.getElementById('add-row-btn');
const tableBody = document.getElementById('product-table-body');
const createTotalBtn = document.getElementById('createTotal');

// Función para agregar una nueva fila
function agregarFila() {
    // Crear una nueva fila (tr)
    const newRow = document.createElement('tr');

    // Crear las celdas (td) con los campos de entrada (input)
    newRow.innerHTML = `
        <td><input type="text" placeholder="Producto/Servicio" class="input-cell"></td>
        <td><input type="text" placeholder="Descripción" class="input-cell"></td>
        <td><input type="number" placeholder="$ 0.00" class="input-cell price" step="0.01"></td>
        <td><input type="number" placeholder="0 %" class="input-cell discount" min="0" max="100"></td>
        <td><input type="number" placeholder="1" class="input-cell quantity" min="1"></td>
        <td><input type="number" placeholder="$ 0.00" class="input-cell total" step="0.01" readonly></td>
        <td><button class="delete-row-btn" style="display: none;"> - </button></td>
    `;

    // Añadir la nueva fila al cuerpo de la tabla
    tableBody.appendChild(newRow);

    // Verificar el número de filas y mostrar/ocultar botones de eliminar
    mostrarBotonesEliminar();

    // Agregar evento al botón de eliminar de la nueva fila
    const deleteButton = newRow.querySelector('.delete-row-btn');
    deleteButton.addEventListener('click', eliminarFila);

    // Agregar eventos a los campos de entrada para actualizar el total
    addEventListenersToRow(newRow);
}

// Función para eliminar una fila
function eliminarFila(event) {
    const fila = event.target.closest('tr');
    fila.remove();
    mostrarBotonesEliminar(); // Actualizar visibilidad de los botones después de eliminar
}

// Función para mostrar u ocultar los botones de eliminar
function mostrarBotonesEliminar() {
    const filas = tableBody.querySelectorAll('tr');
    const botonesEliminar = tableBody.querySelectorAll('.delete-row-btn');

    // Mostrar botones solo si hay 2 o más filas
    if (filas.length >= 2) {
        botonesEliminar.forEach((boton) => {
            boton.style.display = 'inline-block';
        });
    } else {
        botonesEliminar.forEach((boton) => {
            boton.style.display = 'none';
        });
    }
}

// Función para actualizar el campo de total
function updateTotal(row) {
    const priceInput = row.querySelector(".price");
    const discountInput = row.querySelector(".discount");
    const quantityInput = row.querySelector(".quantity");
    const totalInput = row.querySelector(".total");

    // Obtén los valores de precio, descuento y cantidad
    const price = parseFloat(priceInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;
    const quantity = parseInt(quantityInput.value) || 0;

    // Cálculo del total: Precio * Cantidad - Descuento
    const subtotal = price * quantity;
    const total = subtotal - (subtotal * discount / 100);

    // Actualiza el campo de total
    totalInput.value = total.toFixed(2);
}

// Función para añadir eventos a cada fila de la tabla
function addEventListenersToRow(row) {
    const inputs = row.querySelectorAll(".price, .discount, .quantity");

    // Añadir evento a cada input para recalcular el total
    inputs.forEach(input => {
        input.addEventListener("input", () => updateTotal(row));
    });
}

// Añadir eventos a las filas existentes al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach(addEventListenersToRow);
    mostrarBotonesEliminar();
});

// Agregar evento al botón de agregar fila
addRowBtn.addEventListener('click', agregarFila);

document.getElementById("createTotal").addEventListener("click", function () {
    const rows = document.querySelectorAll("#product-table-body tr");
    let allFieldsFilled = true;
    let subtotal = 0;
  
    // Verificar que todos los campos estén llenos y calcular el total por fila
    rows.forEach(row => {
      const product = row.querySelector('input[type="text"]');
      const description = row.querySelectorAll('input[type="text"]')[1];
      const price = row.querySelector('.price');
      const discount = row.querySelector('.discount');
      const quantity = row.querySelector('.quantity');
      const total = row.querySelector('.total');
  
      if (
        !product.value || 
        !description.value || 
        !price.value || 
        !discount.value || 
        !quantity.value
      ) {
        allFieldsFilled = false;
        return;
      }
  
      const priceValue = parseFloat(price.value) || 0;
      const discountValue = parseFloat(discount.value) || 0;
      const quantityValue = parseFloat(quantity.value) || 0;
  
      // Calcular el total por fila
      const rowTotal = (priceValue - (priceValue * (discountValue / 100))) * quantityValue;
      total.value = rowTotal.toFixed(2);
  
      // Acumular subtotal
      subtotal += rowTotal;
    });
  
    if (!allFieldsFilled) {
      alert("Por favor, llene todos los campos antes de calcular el total.");
      return;
    }
  
    // Calcular IVA y total
    const iva = subtotal * 0.16;
    const totalGeneral = subtotal + iva;
  
    // Mostrar resultados debajo de la tabla
    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = `
      <div>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>IVA (16%): $${iva.toFixed(2)}</p>
        <p>Total: $${totalGeneral.toFixed(2)}</p>
      </div>
    `;
  });

// Variables globales para almacenar los datos -----------------
const downloadPDFBtn = document.getElementById('downloadPDF');

// Función para calcular el total
document.getElementById('createTotal').addEventListener('click', function () {
  const rows = document.querySelectorAll('#product-table-body tr');
  let subtotal = 0;

  // Limpiar tabla imprimible
  const printableBody = document.getElementById('printable-product-table-body');
  printableBody.innerHTML = '';

  // Llenar los datos de la tabla imprimible
  rows.forEach((row) => {
    const name = row.querySelector('input[placeholder="Producto/Servicio"]').value;
    const description = row.querySelector('input[placeholder="Descripción"]').value;
    const price = parseFloat(row.querySelector('.price').value) || 0;
    const discount = parseFloat(row.querySelector('.discount').value) || 0;
    const quantity = parseInt(row.querySelector('.quantity').value) || 1;

    const total = price * quantity * (1 - discount / 100);
    subtotal += total;

    // Crear una nueva fila para la tabla imprimible
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${name}</td>
      <td>${description}</td>
      <td>$${price.toFixed(2)}</td>
      <td>${quantity}</td>
      <td>$${total.toFixed(2)}</td>
    `;
    printableBody.appendChild(newRow);
  });

  // Calcular IVA y total
  const iva = subtotal * 0.16;
  const totalGeneral = subtotal + iva;

  // Actualizar resumen imprimible
  document.getElementById('printable-subtotal').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  document.getElementById('printable-iva').textContent = `IVA (16%): $${iva.toFixed(2)}`;
  document.getElementById('printable-total').textContent = `Total: $${totalGeneral.toFixed(2)}`;

  // Mostrar el botón para descargar PDF
  downloadPDFBtn.style.display = 'block';
});

// Generar el PDF al hacer clic en el botón
downloadPDFBtn.addEventListener('click', function () {
  const printableArea = document.getElementById('printableArea');

  const options = {
    margin: 0.5,
    filename: 'ticket_venta.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  // Mostrar el área imprimible y generar el PDF
  printableArea.style.display = 'block';
  html2pdf().from(printableArea).set(options).save().finally(() => {
    printableArea.style.display = 'none';
  });
});