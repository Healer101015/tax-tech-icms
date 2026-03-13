function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-surface p-8 rounded-xl border border-gray-800 shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Tax-Tech B2B</h1>
        <p className="text-textMuted mb-6">Plataforma de negociação de ICMS.</p>
        <button className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors">
          Acessar Painel
        </button>
      </div>
    </div>
  )
}

export default App