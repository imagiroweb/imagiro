/**
 * Point de composition racine (Vertical Slice Architecture).
 * Assemble le layout partagé et les slices.
 * @returns {JSX.Element}
 */
import Layout from './shared/layout/Layout.jsx'
import HomePage from './slices/home/HomePage.jsx'
import './App.css'

function App() {
  return (
    <Layout>
      <HomePage />
    </Layout>
  )
}

export default App
