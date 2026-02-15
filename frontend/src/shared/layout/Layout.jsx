import Header from './Header.jsx'
import Footer from './Footer.jsx'

/**
 * Layout principal : header + contenu + footer (Vertical Slice Architecture — shared).
 * @param {object} props
 * @param {React.ReactNode} props.children - Contenu principal
 * @returns {JSX.Element}
 */
function Layout({ children }) {
  return (
    <div className="app">
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
