const inputBusqueda = document.getElementById("busqueda");
const galeria = document.getElementById("galeria");

inputBusqueda.addEventListener("input", async () => {
  const termino = inputBusqueda.value.trim();
  galeria.innerHTML = "";

  if (termino === "") {
    await mostrar();
    return;
  }

  try {
    const resDescripcion = await fetch(`http://127.0.0.1:8000/imagen-info/${termino}`);
    if (resDescripcion.ok) {
      const datos = await resDescripcion.json();
      mostrarCoincidencias(datos.coincidencias);
      return;
    }

    // Si no encuentra por descripción, intenta por autor
    const resAutor = await fetch(`http://127.0.0.1:8000/imagen-autor/${termino}`);
    if (resAutor.ok) {
      const datos = await resAutor.json();
      mostrarCoincidencias(datos.coincidencias);
      return;
    }

    // Si ninguna coincidencia
    galeria.innerHTML = "<p>No se encontraron resultados.</p>";
  } catch (error) {
    galeria.innerHTML = "<p>Error al buscar.</p>";
  }
});

function mostrarCoincidencias(imagenes) {
  galeria.innerHTML = "";
  imagenes.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("tarjeta");

    div.innerHTML = `
    <img src="http://127.0.0.1:8000/uploads/${item.nombre_guardado}" alt="${item.descripcion}" width="400" height="200" />
    <div class="info">
    <p class="descripcion">${item.descripcion}</p>
    <p class="autor">${item.autor}</p>
    <p class="fecha">${item.fecha}</p>
    </div>
    `;
    galeria.appendChild(div);
  });
}


async function mostrar() {
  const galeria = document.getElementById("galeria");
  galeria.innerHTML = "";

  const respuesta = await fetch("http://127.0.0.1:8000/imagenes");
  const datos = await respuesta.json();

  datos.imagenes.forEach(img => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="http://127.0.0.1:8000/uploads/${img.nombre_guardado}" width="350" height="245" />
    `;
    galeria.appendChild(div);
  });
}

async function buscar() {
  const termino = document.getElementById("busqueda").value;
  const respuesta = await fetch(`http://127.0.0.1:8000/imagen-info/${termino}`);
  const datos = await respuesta.json();

  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = "";
  document.getElementById("galeria").style.display = "none";

  datos.coincidencias.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${item.descripcion}</h3>
      <p><strong>Autor:</strong> ${item.autor}</p>
      <p><strong>Fecha:</strong> ${item.fecha}</p>
      <img src="http://127.0.0.1:8000/uploads/${item.nombre_guardado}" width="200" />
    `;
    contenedor.appendChild(div);
    
  });

}

mostrar()