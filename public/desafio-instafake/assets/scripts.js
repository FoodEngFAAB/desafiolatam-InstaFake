//Levantar servicios nodemosn npm run watch

//Variables del index.html
const formLogin = document.querySelector('#formLoginInsta')
const btnCerrar = document.querySelector('#btnCerrar')
const btnMostrarMas = document.querySelector('#btnMostrarMas')
const txtEmail = document.getElementById('txtEmail')
const txtPassword = document.getElementById('txtPassword')

//Contador de imágenes que se agregan con el botón "More..."
var contadorDeFotos = 1

//Evento submit al presionar Login
formLogin.addEventListener('submit', async (event) => {
    event.preventDefault()
    const token = await validarUsuario(txtEmail.value, txtPassword.value)
    obtenerFotografias(token)
    limpiarFormulario()
})

//Valida usuario(a) y almacena atributos de las propiedades de la DB user.json
const validarUsuario = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({
                    email: email, 
                    password: password 
                })
            })
        
        //Token (valor alfanumérico) almacenado localmente
        const { token } = await response.json()
        localStorage.setItem('llaveJwt', token)
        
        //Verificación de validez del token (distinto de "null" o "undefined") y de credenciales de usuarios
        if (token) {
            return token
        } else {
            alert('Error al verificar los datos. Vuelva a ingresar su email y password.')
        }

    } catch (error) {
        console.error(error)
    }
};


const obtenerFotografias = async (jwt) => {
    try {
        const response = await fetch(`http://localhost:3000/api/photos?page=${contadorDeFotos}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt} `
                }
            })
        const { data } = await response.json()
        
        //Verificación de validez del data (distinto de "null" o "undefined")
        //Si verificación es correcta, pasa "data" a función construirCard; caso contrario, mensaje de error
        if (data) {
            construirCard(data)
        } else {
            console.log('Error al imprimir las fotografías.')
        }

    } catch (error) {
        console.error(error)
    }
};


const construirCard = (data) => {

    //Nuevo arreglo y uso de slice() para imprimir tres imágenes
    nuevoArreglo = data.slice(0, 3)
    
    //Utiliza Bootstrap para cambio a clase formulario para desaparecer con d-none
    formLogin.className = "col-md-6 d-none"
    
    nuevoArreglo.forEach(elemento => {
        document.getElementById('cardImagenes').innerHTML += `
            <div class="card mt-3 mb-4">
                <img src="${elemento.download_url}" class="card-img-top">
                <div class="card-body">
                    <p class="card-text">Autor: ${elemento.author}</p>
                </div>
            </div>`
    })

    //Utiliza Bootstrap para cambio a clase fotografía cambiando d-none por d-block
    document.getElementById("contenedorSeccionImagenes").className = "col-md-8 mt-3 d-block";
}

const limpiarFormulario = () => {
    txtEmail.value = ""
    txtPassword.value = ""
};


btnCerrar.addEventListener('click', () => {
    
    //clear() método que al invocarlo, elimina todos los registros del almacén local.
    localStorage.clear();

    //reload() método que carga de nuevo la URL actual, como lo hace el botón de Refresh de los navegadores.
    location.reload();
});


btnMostrarMas.addEventListener('click', () => {

    //Nuevo token con valor llaveJwt liberado para uso en validarUsuario()
    const token = localStorage.getItem('llaveJwt');
    if (token) {
        //Con token válido (diferente a "null o undefined"), se suma 1 a contadorDeFotos y se llama a función de impresión de nuevas fotografías
        contadorDeFotos++;
        obtenerFotografias(token)
    }
})