/**
 * Pied de page partagé du site (Vertical Slice Architecture — shared).
 * @returns {JSX.Element}
 */
function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Imagiro</p>
    </footer>
  )
}

export default Footer
