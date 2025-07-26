const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("No se especificó la imagen a editar");
  window.location.href = "index.html";
}

// Obtener y llenar datos
fetch(`http://127.0.0.1:8000/imagen-id/${id}`)
  .then((res) => res.json())
  .then((data) => {
    document.querySelector("[name='descripcion']").value = data.descripcion;
    document.querySelector("[name='autor']").value = data.autor;
    document.querySelector("[name='fecha']").value = data.fecha;
  });

// Manejar envío del formulario
document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const descripcion = document.querySelector("[name='descripcion']").value;
  const autor = document.querySelector("[name='autor']").value;
  const fecha = document.querySelector("[name='fecha']").value;

  const formData = new FormData();
  formData.append("descripcion", descripcion);
  formData.append("autor", autor);
  formData.append("fecha", fecha);

  const response = await fetch(`http://127.0.0.1:8000/editar-imagen/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (response.ok) {
    window.location.href = "index.html";
  } else {
    alert("Error al guardar cambios");
  }
});

