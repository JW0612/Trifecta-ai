import ollama
import math
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Configuración de CORS para que tu React (Frontend) pueda comunicarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestData(BaseModel):
    prompt: str

@app.post("/calc-neumatica")
async def calcular_con_ia(data: RequestData):
    prompt_usuario = data.prompt
    
    # Instrucción técnica para el modelo Qwen o Llama
    # Le pedimos que sea estricto para evitar cálculos "al azar"
    instruccion = (
        "Actúa como un extractor de datos de ingeniería. "
        f"Del siguiente texto: '{prompt_usuario}', extrae el diámetro del pistón y la presión. "
        "Responde ÚNICAMENTE en este formato: diametro,presion. "
        "Si no encuentras valores numéricos o el texto no tiene sentido técnico, responde: ERROR"
    )
    
    try:
        # Llamada a Ollama
        response = ollama.generate(model='qwen2.5-coder:7b', prompt=instruccion)
        respuesta_ia = response['response'].strip()
        
        # Validación de seguridad
        if "ERROR" in respuesta_ia.upper() or not any(char.isdigit() for char in respuesta_ia):
            return {"error": "No se detectaron datos técnicos válidos. Por favor especifica diámetro y presión."}

        # Extraer los números con Regex
        valores = re.findall(r"[-+]?\d*\.\d+|\d+", respuesta_ia)
        
        if len(valores) < 2:
            return {"error": "Faltan datos (se requiere diámetro y presión)."}

        d = float(valores[0])
        p = float(valores[1])
        
        # Lógica de Ingeniería (Pneumática)
        area = (math.pi * math.pow(d, 2)) / 4
        fuerza_lb = area * p
        fuerza_n = fuerza_lb * 4.44822
        
        return {
            "input_detectado": f"Pistón: {d} in | Presión: {p} psi",
            "area_pulg2": round(area, 4),
            "fuerza_libras": round(fuerza_lb, 2),
            "fuerza_newtons": round(fuerza_n, 2),
            "error": None
        }

    except Exception as e:
        return {"error": f"Error en el motor de IA: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)