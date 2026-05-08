from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Suma(BaseModel):
    a: float
    b: float

@app.get("/")
def root():
    return {"message": "Trifecta IA backend funcionando"}

@app.get("/saludo")
def saludo(nombre: str = "raul"):
    return {"mensaje": f"Hola, {nombre}"}

@app.post("/sumar")
def sumar(datos: Suma):
    resultado = datos.a + datos.b
    return {
        "a": datos.a,
        "b": datos.b,
        "resultado": resultado
    }