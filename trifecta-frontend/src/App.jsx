import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState("");
  // Aquí guardaremos los datos que nos envíe Python
  const [resultado, setResultado] = useState(null);

  // Esta función es la que hace la conexión con el Backend
  const calcularNeumatica = async () => {
    try {
      const respuesta = await fetch("http://127.0.0.1:8000/calc-neumatica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diametro_piston: 2.0, // Dato de prueba
          presion_psi: 80       // Dato de prueba
        })
      });
      const data = await respuesta.json();
      setResultado(data); // Guardamos la respuesta para mostrarla
    } catch (error) {
      console.error("Error al conectar:", error);
      alert("Error: Asegúrate de que el Backend esté corriendo.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      {/* SIDEBAR: Panel lateral azul oscuro */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-5 shadow-2xl">
        <h1 className="text-2xl font-bold mb-10 text-blue-400 tracking-tight">Trifecta IA</h1>
        <nav className="flex-1 space-y-3">
          <button className="w-full text-left p-3 hover:bg-slate-800 rounded-lg transition-all">
            ⚙️ Neumática
          </button>
          <button className="w-full text-left p-3 hover:bg-slate-800 rounded-lg transition-all">
            📐 Momentos
          </button>
          <button className="w-full text-left p-3 hover:bg-slate-800 rounded-lg transition-all">
            📄 Subir Ficha
          </button>
        </nav>
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
          Status: Conectado a FastAPI
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col p-8">
        
        {/* PANEL DE RESULTADOS (BLANCO) */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6 overflow-y-auto">
          {resultado ? (
            /* SI HAY RESULTADO: Mostramos las cajitas de ingeniería */
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-blue-600 border-b pb-2">Resultado del Cálculo</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold">Área del Pistón</p>
                  <p className="text-lg font-mono">{resultado.area_pulg2} in²</p>
                </div>
                <div className="p-3 bg-blue-50 rounded border border-blue-100">
                  <p className="text-xs text-gray-500 uppercase font-bold">Fuerza Teórica</p>
                  <p className="text-lg font-bold text-blue-700">{resultado.fuerza_libras} lbs</p>
                </div>
                <div className="p-3 bg-green-50 rounded border border-green-100">
                  <p className="text-xs text-gray-500 uppercase font-bold">Fuerza (SI)</p>
                  <p className="text-lg font-mono">{resultado.fuerza_newtons} N</p>
                </div>
              </div>
            </div>
          ) : (
            /* SI NO HAY RESULTADO: Mostramos el mensaje de bienvenida */
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-lg">Panel de Control de Ingeniería</p>
              <p className="text-sm italic">Presiona enviar para calcular (Pistón 2" @ 80PSI)</p>
            </div>
          )}
        </div>

        {/* INPUT DE CHAT (BARRA INFERIOR) */}
        <div className="flex gap-3 bg-white p-3 rounded-xl shadow-lg border border-gray-200">
          <textarea
            className="flex-1 p-3 focus:outline-none resize-none text-gray-700"
            placeholder="Escribe aquí tu prompt de ingeniería..."
            rows="2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={calcularNeumatica}
            className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-all self-end shadow-md active:scale-95"
          >
            Enviar
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;