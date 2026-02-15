import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Imagiro</h1>
        <p className="tagline">Site vitrine</p>
      </header>
      <main className="main">
        <section>
          <h2>Bienvenue</h2>
          <p>Bienvenue sur le site vitrine d'Imagiro.</p>
        </section>
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Imagiro</p>
      </footer>
    </div>
  )
}

export default App
