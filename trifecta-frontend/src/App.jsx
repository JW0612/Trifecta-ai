import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [respuesta, setRespuesta] = useState('Aquí aparecerá la respuesta...');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-3xl font-bold text-center mb-8 text-blue-600">
        Trifecta IA - Copiloto Mecánico
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {/* Sidebar */}
        <aside className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-4">Herramientas</h2>
          <button className="w-full bg-blue-500 text-white p-2 rounded mb-2">Neumática</button>
          <button className="w-full bg-green-500 text-white p-2 rounded mb-2">Calculadoras</button>
          <button className="w-full bg-purple-500 text-white p-2 rounded">Upload Docs</button>
        </aside>
        {/* Centro: Prompt + Respuesta */}
        <main className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu pregunta de diseño (ej: peso CDRQ2BS30TN)..."
            className="w-full h-32 p-4 border rounded-lg mb-4 resize-none"
          />
          <div className="bg-gray-50 p-4 rounded-lg min-h-40">
            {respuesta}
          </div>
          <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Enviar
          </button>
        </main>
      </div>
    </div>
  );
}

export default App;