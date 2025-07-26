document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  const response = await fetch("http://127.0.0.1:8000/upload/", {
    method: "POST",
    body: data,
  });

  const resultado = await response.json();
  alert("Imagen subida correctamente");
  console.log(resultado);
  form.reset();
});

async function buscar() {
  const termino = document.getElementById("busqueda").value;
  const respuesta = await fetch(`http://127.0.0.1:8000/imagen-info/${termino}`);
  const datos = await respuesta.json();

  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = "";

  datos.coincidencias.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <img src="http://127.0.0.1:8000/uploads/${item.nombre_guardado}" alt="${item.descripcion}" width="240" height="200" />
    <p class="descripcion">${item.descripcion}</p>
    <p class="autor">${item.autor}</p>
    <p class="fecha">${item.fecha}</p>
    <button><a href="editar.html?id=${item.nombre_guardado}">Editar</a></button>
    <button onclick="eliminar('${item.nombre_guardado}')"><a>Eliminar</a></button>
    `;
    contenedor.appendChild(div);
  });
}

async function eliminar(nombre) {
  if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) return;

  const respuesta = await fetch(`http://127.0.0.1:8000/eliminar/${nombre}`, {
    method: "DELETE"
  });

  if (respuesta.status === 204) {
    alert("Imagen eliminada correctamente");
    buscar(); // Vuelve a cargar la búsqueda actual
  } else {
    const error = await respuesta.json();
    alert("Error al eliminar: " + error.detail);
  }
}

async function buscarPorAutor() {
    const autor = document.getElementById("autorBusqueda").value;
    const contenedor = document.getElementById("resultadoAutor");
    contenedor.innerHTML = ""; // Limpiar antes

    try {
        const respuesta = await fetch(`http://127.0.0.1:8000/imagen-autor/${autor}`);
        const datos = await respuesta.json();

        datos.coincidencias.forEach((item) => {
            const div = document.createElement("div");
            div.innerHTML = `
            <img src="http://127.0.0.1:8000/uploads/${item.nombre_guardado}" alt="${item.descripcion}" width="240" height="200" />
            <p class="descripcion">${item.descripcion}</p>
            <p class="autor">${item.autor}</p>
            <p class="fecha">${item.fecha}</p>
            <button><a href="editar.html?id=${item.nombre_guardado}">Editar</a></button>
            <button onclick="eliminar('${item.nombre_guardado}')"><a>Eliminar</a></button>
            `;
            contenedor.appendChild(div);
        });
    } catch (error) {
        contenedor.innerHTML = "<p>No se encontraron imágenes.</p>";
    }
}
