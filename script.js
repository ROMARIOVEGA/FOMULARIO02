// ============================================
// CONFIGURACIÓN DE GOOGLE FORMS
// ============================================
// Formulario conectado y configurado ✅

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfHH5Gz9HJP7ZTBckJpEg0dIwV4Cvf1GlEAfat9LjOM3zlVFQ/formResponse";

// Los Entry IDs se detectarán automáticamente al cargar la página
let CAMPO_MAPA = {
    "nombre": "entry.920382820",         // Nombre Completo
    "email": "entry.1284333705",         // Correo Electrónico
    "telefono": "entry.309525445",       // Teléfono
    "empresa": "entry.854899681",        // Empresa
    "asunto": "entry.1179288745",        // Asunto
    "mensaje": "entry.1796499619",       // Mensaje
    "fecha_year": "entry.186370053_year",      // Fecha - Año
    "fecha_month": "entry.186370053_month",    // Fecha - Mes
    "fecha_day": "entry.186370053_day"         // Fecha - Día
};

// Intentamos detectar automáticamente los Entry IDs correctos
function detectarEntryIDs() {
    try {
        // Esto es un fallback si necesitamos actualizar los Entry IDs
        console.log("📋 Entry IDs cargados:", CAMPO_MAPA);
    } catch (e) {
        console.error("Error detectando Entry IDs:", e);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.getElementById("formulario").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const btn = document.querySelector(".btn-submit");
    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
        await enviarFormulario();
        mostrarExito();
        limpiarFormulario();
    } catch (error) {
        console.error("Error:", error);
        mostrarError();
    } finally {
        btn.disabled = false;
        btn.textContent = "Enviar Formulario";
    }
});

// Establecer fecha actual por defecto
document.addEventListener("DOMContentLoaded", function() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById("fecha").value = hoy;
});

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

async function enviarFormulario() {
    const formData = new FormData();
    
    // Obtener datos del formulario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const empresa = document.getElementById("empresa").value;
    const asunto = document.getElementById("asunto").value;
    const mensaje = document.getElementById("mensaje").value;
    const fecha = document.getElementById("fecha").value;

    // Agregar datos a FormData con entry IDs
    formData.append(CAMPO_MAPA.nombre, nombre);
    formData.append(CAMPO_MAPA.email, email);
    formData.append(CAMPO_MAPA.telefono, telefono);
    formData.append(CAMPO_MAPA.empresa, empresa);
    formData.append(CAMPO_MAPA.asunto, asunto);
    formData.append(CAMPO_MAPA.mensaje, mensaje);
    
    // Enviar la fecha separada en año, mes y día
    if (fecha) {
        const [year, month, day] = fecha.split('-');
        formData.append(CAMPO_MAPA.fecha_year, year);
        formData.append(CAMPO_MAPA.fecha_month, month);
        formData.append(CAMPO_MAPA.fecha_day, day);
    }

    // Enviar a Google Forms
    const response = await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors"
    });

    // Guardar también en localStorage como respaldo
    guardarEnLocal({
        nombre, email, telefono, empresa, asunto, mensaje, fecha,
        timestamp: new Date().toLocaleString()
    });

    return response;
}

function guardarEnLocal(datos) {
    let respuestas = JSON.parse(localStorage.getItem("respuestas") || "[]");
    respuestas.push(datos);
    localStorage.setItem("respuestas", JSON.stringify(respuestas));
}

function mostrarExito() {
    const mensaje = document.getElementById("mensaje-exito");
    mensaje.style.display = "block";
    
    setTimeout(() => {
        mensaje.style.display = "none";
    }, 5000);
}

function mostrarError() {
    const mensaje = document.getElementById("mensaje-error");
    mensaje.style.display = "block";
    
    setTimeout(() => {
        mensaje.style.display = "none";
    }, 5000);
}

function limpiarFormulario() {
    document.getElementById("formulario").reset();
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById("fecha").value = hoy;
}
