import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer.jsx'

describe('Footer', () => {
  it('affiche le copyright avec l’année courante', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument()
  })

  it('contient un pied de page', () => {
    render(<Footer />)
    const footer = document.querySelector('footer.footer')
    expect(footer).toBeInTheDocument()
  })
})
