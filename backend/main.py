from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import shutil
import math # Importamos matemáticas para usar PI

app = FastAPI()

# CONFIGURACIÓN DE CORS: Permite que React (puerto 5173) hable con Python (puerto 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# MODELO DE DATOS: Definimos qué necesita la calculadora neumática
class CalculoNeumatico(BaseModel):
    diametro_piston: float  # En pulgadas
    presion_psi: float      # En PSI

@app.get("/")
def root():
    return {"message": "Trifecta IA backend funcionando"}

# NUEVA RUTA: Calculadora de Fuerza de Cilindro
@app.post("/calc-neumatica")
def calcular_fuerza(datos: CalculoNeumatico):
    # FÓRMULA: Fuerza = Presión * Área
    # Área = (PI * D^2) / 4
    area = (math.pi * math.pow(datos.diametro_piston, 2)) / 4
    fuerza_lb = area * datos.presion_psi
    
    # Comentario técnico: Devolvemos los datos procesados
    return {
        "area_pulg2": round(area, 4),
        "fuerza_libras": round(fuerza_lb, 2),
        "fuerza_newtons": round(fuerza_lb * 4.44822, 2) # Conversión a SI
    }

# (Mantenemos la ruta de upload que ya tenías abajo...)