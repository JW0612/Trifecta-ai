from fastapi import FastAPI
from pydantic import BaseModel
import ollama
import math
import re  # <--- IMPORTANTE
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# 2. Agrega este bloque de "permisos"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite conexiones desde tu React
    allow_credentials=True,
    allow_methods=["*"], # Permite POST, OPTIONS, etc.
    allow_headers=["*"],
)

class RequestData(BaseModel):
    prompt: str

@app.post("/calc-neumatica")
async def calcular_con_ia(data: RequestData):
    prompt_usuario = data.prompt
    
    instruccion = (
        "Extrae los valores numéricos de diámetro (inches) y presión (psi). "
        f"Texto: '{prompt_usuario}'. "
        "Responde solo con los números separados por coma. Ejemplo: 2.5,90"
    )
    
    try:
        # Usamos el modelo chico que corre bien en tu equipo
        response = ollama.generate(model='qwen2.5-coder:1.5b', prompt=instruccion)
        respuesta_ia = response['response'].strip()
        
        # El REGEX busca cualquier número (con o sin decimales)
        valores = re.findall(r"[-+]?\d*\.\d+|\d+", respuesta_ia)
        
        if len(valores) < 2:
            return {"error": "No se detectaron diámetro y presión. Intenta decir: 'piston de 2 pulg a 90 psi'"}

        d = float(valores[0])
        p = float(valores[1])
        
        area = (math.pi * math.pow(d, 2)) / 4
        fuerza_lb = area * p
        fuerza_n = fuerza_lb * 4.44822
        
        return {
            "input_detectado": f"Dato extraído: {d} in @ {p} psi",
            "area_pulg2": round(area, 4),
            "fuerza_libras": round(fuerza_lb, 2),
            "fuerza_newtons": round(fuerza_n, 2),
            "error": None
        }

    except Exception as e:
        return {"error": f"Error de conexión: {str(e)}"}