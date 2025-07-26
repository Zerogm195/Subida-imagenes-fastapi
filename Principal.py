from fastapi import FastAPI
from fastapi import Form
from fastapi import FastAPI, File, UploadFile
from fastapi import HTTPException
from uuid import uuid4
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import status
import os

app = FastAPI()

ruta_json = Path("Datos.json")

#API

@app.get("/")
def root():
    return {"message": "¡Hola Zuro!"}

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

#Obtener imagenes

@app.get("/imagenes")
def obtenerimagenes():
    if ruta_json.exists():
        with open(ruta_json, "r", encoding="utf-8") as f:
            datos = json.load(f)

    else:
        datos = []

    return {"imagenes": datos}    

#Obtener imagen por descripción
@app.get("/imagen-info/{descripcion}")
def obtenerimagen(descripcion: str):
    if ruta_json.exists():
        with open(ruta_json, "r", encoding="utf-8") as f:
            datos = json.load(f)
    else:
        datos = []

    coincidencias = [
        item for item in datos 
        if descripcion.lower() in item["descripcion"].lower()
    ]

    if not coincidencias:
        raise HTTPException(status_code=404, detail="No se encontraron imágenes con esa descripción")

    return {
        "coincidencias": coincidencias
    }

#Obtener imagenes por autor

@app.get("/imagen-autor/{autor}")
def imagenes_por_autor(autor: str):
    if ruta_json.exists():
        with open(ruta_json, "r", encoding="utf-8") as f:
            datos = json.load(f)
    else:
        datos = []

    coincidencias = [
        item for item in datos 
        if autor.lower() in item["autor"].lower()
    ]

    if not coincidencias:
        raise HTTPException(status_code=404, detail="No se encontraron imágenes de ese autor")

    return {
        "coincidencias": coincidencias
    }



@app.get("/metadatos")
def metadatos():
    if ruta_json.exists():
        with open(ruta_json, "r", encoding="utf-8") as f:
            datos = json.load(f)
    else:
        datos = []

    return{
        "datos" : datos
    }    

@app.post("/upload/")
async def upload_image(

    archivo: UploadFile = File(...),
    descripcion: str = Form(...),
    autor: str = Form(...),
    fecha: str = Form(...),
    
    ):

    miarchivo = await archivo.read()
    nombrearchivo = f"{uuid4()}.png"

    #Json

    # Leer archivo si existe, si no, empezar con lista vacía

    if ruta_json.exists():
        with open(ruta_json, "r", encoding="utf-8") as f:
            datos = json.load(f)
    else:
        datos = []
    

    # Añadir nuevo registro
    nuevo_registro = {
    "nombre_original": archivo.filename,
    "nombre_guardado": nombrearchivo,
    "tipo": archivo.content_type,
    "descripcion": descripcion,
    "autor": autor,
    "fecha": fecha
    }

    datos.append(nuevo_registro)

    # Guardar actualizado
    with open(ruta_json, "w", encoding="utf-8") as f:
        json.dump(datos, f, indent=4, ensure_ascii=False)


    if archivo.content_type in ["image/jpeg" ,"image/png"]:
        with open(f"uploads/{nombrearchivo}", "wb") as buffer:
             buffer.write(miarchivo)
        return {
            "Nombre del archivo": archivo.filename,
            "Tipo de archivo" : archivo.content_type,
            "Descripción" : descripcion,
            "Tamaño" : len(miarchivo),
            "Autor" : autor,
            "Fecha de subida" : fecha,
            "Guardado en" : f"./uploads como {nombrearchivo}"
            }

    else:
        raise HTTPException(status_code=400, detail="Tipo de archivo no permitido")

#Frontend

# Permitir conexión desde navegador
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes restringirlo si deseas
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivo HTML principal
@app.get("/web")
def web():
    return FileResponse("frontend/index.html")

@app.get("/imagen-id/{nombre_guardado}")
def imagen_por_id(nombre_guardado: str):
    if ruta_json.exists():
        with open(ruta_json, "r", encoding="utf-8") as f:
            datos = json.load(f)
    else:
        raise HTTPException(status_code=404, detail="Base de datos no encontrada")

    for item in datos:
        if item["nombre_guardado"] == nombre_guardado:
            return item

    raise HTTPException(status_code=404, detail="Imagen no encontrada")

@app.put("/editar-imagen/{nombre_guardado}")
async def editar_imagen(
    nombre_guardado: str,
    descripcion: str = Form(...),
    autor: str = Form(...),
    fecha: str = Form(...)
):
    if ruta_json.exists():
        with open(ruta_json, "r", encoding="utf-8") as f:
            datos = json.load(f)
    else:
        raise HTTPException(status_code=404, detail="Base de datos no encontrada")

    for item in datos:
        if item["nombre_guardado"] == nombre_guardado:
            item["descripcion"] = descripcion
            item["autor"] = autor
            item["fecha"] = fecha

            with open(ruta_json, "w", encoding="utf-8") as f:
                json.dump(datos, f, indent=4, ensure_ascii=False)

            return {"mensaje": "Datos actualizados"}

    raise HTTPException(status_code=404, detail="Imagen no encontrada")



@app.delete("/eliminar/{nombre_guardado}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_imagen(nombre_guardado: str):
    if not ruta_json.exists():
        raise HTTPException(status_code=404, detail="No hay datos registrados")

    with open(ruta_json, "r", encoding="utf-8") as f:
        datos = json.load(f)

    nuevos_datos = [item for item in datos if item["nombre_guardado"] != nombre_guardado]

    if len(nuevos_datos) == len(datos):
        raise HTTPException(status_code=404, detail="No se encontró la imagen a eliminar")

    with open(ruta_json, "w", encoding="utf-8") as f:
        json.dump(nuevos_datos, f, indent=4, ensure_ascii=False)

    ruta_imagen = Path("uploads") / nombre_guardado
    if ruta_imagen.exists():
        os.remove(ruta_imagen)

    return {"message": "Imagen eliminada correctamente"}


@app.get("/imagen-autor/{autor}")
def imagenes_por_autor(autor: str):
    if ruta_json.exists():
        with open(ruta_json, "r", encoding="utf-8") as f:
            datos = json.load(f)
    else:
        datos = []

    coincidencias = [
        item for item in datos 
        if autor.lower() in item["autor"].lower()
    ]

    if not coincidencias:
        raise HTTPException(status_code=404, detail="No se encontraron imágenes de ese autor")

    return {
        "coincidencias": coincidencias
    }
