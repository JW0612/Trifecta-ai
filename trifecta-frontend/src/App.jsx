import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState(""); 
  const [resultado, setResultado] = useState(null); 
  const [cargando, setCargando] = useState(false); 

  const calcularNeumatica = async () => {
    if (!prompt) return;
    setCargando(true);
    try {
      const respuesta = await fetch("http://127.0.0.1:8000/calc-neumatica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt })
      });
      const data = await respuesta.json();
      if (data.error) {
        alert(data.error);
        setResultado(null);
      } else {
        setResultado(data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor de Python");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Izquierdo */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-blue-400">Trifecta IA</h2>
        <nav className="flex flex-col gap-4">
          <button className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <span>⚙️</span> Neumática
          </button>
          <button className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <span>📐</span> Momentos
          </button>
          <button className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <span>📄</span> Subir Ficha
          </button>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* Tarjeta de Resultados */}
          {resultado && (
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 mb-8 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-blue-700 mb-6 border-b pb-2">Resultado del Cálculo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Área del Pistón</p>
                  <p className="text-2xl font-mono text-gray-700">{resultado.area_pulg2} in²</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-400 uppercase font-bold mb-1">Fuerza Teórica</p>
                  <p className="text-3xl font-bold text-blue-600">{resultado.fuerza_libras} lbs</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <p className="text-xs text-green-500 uppercase font-bold mb-1">Fuerza (SI)</p>
                  <p className="text-2xl font-bold text-green-600">{resultado.fuerza_newtons} N</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-400 italic">🤖 {resultado.input_detectado}</p>
            </div>
          )}

          {/* Input de Usuario */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Asistente de Ingeniería</h3>
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-lg transition-all"
              rows="4"
              placeholder="Ej: Necesito la fuerza de un pistón de 3.5 pulgadas a 100 psi..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            
            <button
              onClick={calcularNeumatica}
              disabled={cargando}
              className={`mt-6 w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all active:scale-95 ${
                cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {cargando ? "Procesando con IA Local..." : "Calcular Fuerza"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;