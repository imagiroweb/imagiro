import Header from './Header.jsx'
import Footer from './Footer.jsx'

/**
 * Layout principal : header + contenu + footer (Vertical Slice Architecture — shared).
 * @param {object} props
 * @param {React.ReactNode} props.children - Contenu principal
 * @param {object|null} props.user - Utilisateur connecté
 * @param {() => void} props.logout - Déconnexion
 * @param {(page: string) => void} props.onNavigate - Navigation (home, login, signup)
 * @returns {JSX.Element}
 */
function Layout({ children, user, logout, onNavigate }) {
  return (
    <div className="app">
      <Header user={user} logout={logout} onNavigate={onNavigate} />
      <main className="main">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
