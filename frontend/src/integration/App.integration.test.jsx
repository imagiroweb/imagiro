/**
 * Tests d’intégration — Application complète (Layout + slices, sans mocks).
 */
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import App from '../App.jsx'

describe('Intégration App', () => {
  it('affiche la page complète : header, contenu principal, footer', () => {
    render(<App />)

    // Header
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('heading', { name: /imagiro/i })).toBeInTheDocument()
    expect(within(header).getByText(/site vitrine/i)).toBeInTheDocument()

    // Contenu principal (slice Home)
    expect(screen.getByRole('heading', { name: /bienvenue/i })).toBeInTheDocument()
    expect(screen.getByText(/bienvenue sur le site vitrine d'imagiro/i)).toBeInTheDocument()

    // Footer
    const footer = document.querySelector('footer.footer')
    expect(footer).toBeInTheDocument()
    const year = new Date().getFullYear()
    expect(footer).toHaveTextContent(String(year))
  })

  it('structure DOM : un seul header, un main, un footer', () => {
    const { container } = render(<App />)

    const headers = container.querySelectorAll('header')
    const mains = container.querySelectorAll('main')
    const footers = container.querySelectorAll('footer')

    expect(headers).toHaveLength(1)
    expect(mains).toHaveLength(1)
    expect(footers).toHaveLength(1)
  })

  it('contenu principal dans une section', () => {
    const { container } = render(<App />)
    const main = container.querySelector('main.main')
    expect(main).toBeInTheDocument()
    const section = main?.querySelector('section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveTextContent(/bienvenue/i)
  })
})
