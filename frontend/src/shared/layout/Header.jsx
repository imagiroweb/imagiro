/**
 * En-tête partagé du site avec liens auth (Vertical Slice Architecture — shared).
 * @param {object} props
 * @param {object|null} props.user - Utilisateur connecté (ou null)
 * @param {() => void} props.logout - Déconnexion
 * @param {(page: string) => void} props.onNavigate - Navigation (home, login, signup)
 * @returns {JSX.Element}
 */
function Header({ user, logout, onNavigate }) {
  return (
    <header className="header">
      <div className="header-row">
        <h1>
          <button type="button" className="header-logo" onClick={() => onNavigate('home')}>
            Imagiro
          </button>
        </h1>
        <p className="tagline">Site vitrine</p>
      </div>
      <nav className="header-nav">
        {user ? (
          <>
            <span className="header-user">Bonjour, {user.name || user.email}</span>
            <button type="button" className="header-link" onClick={() => onNavigate('security')}>
              Sécurité
            </button>
            <span className="header-sep">|</span>
            <button type="button" className="header-link" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button type="button" className="header-link" onClick={() => onNavigate('login')}>
              Connexion
            </button>
            <span className="header-sep">|</span>
            <button type="button" className="header-link" onClick={() => onNavigate('signup')}>
              Inscription
            </button>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
