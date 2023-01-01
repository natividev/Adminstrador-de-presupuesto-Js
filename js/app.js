// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos
eventListeners();
function eventListeners() {
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
  formulario.addEventListener('submit', agregarGasto);
}

// * Classes
class Presupuesto{
  // Atributos
  constructor(presupuesto){
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto){
    this.gastos = [...this.gastos, gasto]
    this.calcularRestante();
  }

  calcularRestante(){
    // .reduce, itera sobre todos los elementos y va acumulando los valores en un gran total
    const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad,0);
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id){
    this.gastos = this.gastos.filter( gasto => gasto.id !== id );
    this.calcularRestante();

  }  
}

class UI{
  insertarPresupuesto(cantidad){
    // Extrayendo los valores
    const {presupuesto, restante} = cantidad;
    // Agregar al HTML
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo){
    // Crear el DIV
    const divAlerta = document.createElement('DIV');
    divAlerta.classList.add('text-center', 'alert');

    if (tipo === 'error') {
      divAlerta.classList.add('alert-danger')
    }else{
      divAlerta.classList.add('alert-success')
    }

    // Mensaje de error
    divAlerta.textContent = mensaje;

    // Insertar en el html
    document.querySelector('.primario').insertBefore(divAlerta, formulario);

    setTimeout(() => {
      divAlerta.remove();
    }, 3000);

  };

  mostrarGastos(gastos){

    this.limpiarHTML(); // Elimina el HTML previo del gasto listado

    // Iterr sobres los gastos
    gastos.forEach(gasto => {
      
      const {cantidad, nombre, id} = gasto;
      // Crear un LI
      const nuevoGastoLi = document.createElement('LI');
      // className te reporta que clases hay
      nuevoGastoLi.className = 'list-group-item d-flex justify-content-between align-items-center';
      nuevoGastoLi.setAttribute('data-id', id)
      // nuevoGastoLi.dataset.id = id; // Nueva forma de colocarlo un data

      // Agregar el HTML del gasto
      nuevoGastoLi.innerHTML =  `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span> `;

      // Boton para borrar el gasto
      const btnBorrar = document.createElement('BUTTON');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.innerHTML = "Borrar &times;";

      btnBorrar.onclick = ( () => {
        eliminarGasto(id);
      } )
     
      nuevoGastoLi.appendChild(btnBorrar);
      
      // Agregar al HTML
      gastoListado.appendChild(nuevoGastoLi);


    })

  }

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);  
    }
  }

  actualizarRestante(restante){
    document.querySelector('#restante').textContent = restante;
  }
  comprobarPresupuesto(presupuestoObj){
    const {presupuesto, restante} = presupuestoObj;
    const restanteDiv = document.querySelector('.restante');

    // Comprabar 25%, si yo tengo 100 y lo divido entre 4, me da 25
    if ((presupuesto / 4) > restante) {
      restanteDiv.classList.remove('alert-success', 'alert-warning');
      restanteDiv.classList.add('alert-danger');
    }else if ( (presupuesto / 2) > restante ) { // * Comprobar que hemos gastado la mitad
      restanteDiv.classList.remove('alert-success');
      restanteDiv.classList.add('alert-warning');
    }else{
      restanteDiv.classList.remove('alert-danger', 'alert-warning');
      restanteDiv.classList.add('alert-success');
    }

    // * Si el total es 0 o menor
    if (restante < 0) {
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    }else{
      formulario.querySelector('button[type="submit"]').disabled = false;
    }
  }
}

//Instanciar
const ui = new UI();
 
let presupuesto;

// Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt('¿Cuál es tu presupuesto');
  
  if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
  }
  
  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}


function agregarGasto(e) {
  e.preventDefault();
  // Leer los datos del formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);
  
  if (nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
    
  }else if(cantidad <= 0 || isNaN(cantidad)){
    ui.imprimirAlerta('Cantidad no validad', 'error');
    return;
   
  }
  // Generar objeto con el gasto
  const gasto = {nombre, cantidad, id: Date.now()};
  //Añadie un nuevo gasto
  presupuesto.nuevoGasto(gasto);

  // Mensaje de todo salio correcto
  ui.imprimirAlerta('Gasto agregado correctamente');

  // Imprimir los gastos
  const {gastos, restante} = presupuesto;

  ui.mostrarGastos(gastos);
  
  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);

  // Reinicia el formulario
  formulario.reset();  
}

function eliminarGasto(id) {

 // * Los elimina de la clase los gastos
 presupuesto.eliminarGasto(id);

 //* Elimina los gastos del HTML
 const {gastos, restante} = presupuesto;
 ui.mostrarGastos(gastos);
 ui.actualizarRestante(restante);
 ui.comprobarPresupuesto(presupuesto);
  
}
