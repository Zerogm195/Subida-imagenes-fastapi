# 🎨 Galería de imágenes con FastAPI y Frontend
Este es un proyecto personal donde practiqué la conexión entre un backend hecho con FastAPI y un frontend en HTML, CSS y JavaScript, permitiendo subir, editar, buscar y eliminar imágenes como si fuera una pequeña galería web.

## 🚀 Funcionalidades
📤 Subida de imágenes con metadatos (descripción, autor, fecha)

🖼️ Visualización tipo galería, con diseño en modo oscuro

🔍 Búsqueda en tiempo real por descripción (en frontend)

🧠 Búsqueda por autor y filtros adicionales

✏️ Edición de datos asociados a una imagen

❌ Eliminación de imágenes desde la misma interfaz

🌐 Servido con FastAPI y archivos JSON como "base de datos"

## ⚙️ Tecnologías usadas
FastAPI (Python)

JavaScript (vanilla)

HTML5 & CSS3

Fetch API para comunicación frontend-backend

JSON como almacenamiento local de metadatos

## 🗂️ Estructura del proyecto
```bash

├── Principal.py          #Backend
└── Datos.json            #JSON
├── frontend/
│   ├── index.html        # Página principal (galería)
│   ├── subir.html        # Página para subir imágenes
│   ├── editar.html       # Página para editar imágenes
│   ├── index.js          # Lógica galería + búsqueda
│   ├── script.js         # Lógica de subida y búsqueda
│   ├── editar.js         # Lógica de edición
│   └── style.css         # Estilo visual modo oscuro
```
## 🖼️ Capturas

### Vista general de la galería:

<img width="600" height="899" alt="image" src="https://github.com/user-attachments/assets/d3f1c348-741e-4709-9ac4-122ce79be4e3" />

<br>

### Página de subida:

<img width="600" height="898" alt="image" src="https://github.com/user-attachments/assets/1b8f66e9-fc58-408b-9404-f4d0fb222b35" />

<br>

### Página de edición:

<img width="600" height="886" alt="image" src="https://github.com/user-attachments/assets/f72fcac5-2619-4e0b-b470-26b49a070759" />

<br>


## 📝 Cómo ejecutar
Instala las dependencias (FastAPI y Uvicorn):

```bash
pip install fastapi uvicorn
```
Inicia el servidor:

```bash
uvicorn Principal:app --reload
```
Abre el archivo HTML deseado desde un servidor local o usa [Live Server] en VSCode para el frontend.

## 💡 Créditos
Proyecto hecho por Zuro como práctica personal, con la ayuda de Lia ^^
