import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './HomePage.jsx'

describe('HomePage', () => {
  it('affiche le titre Bienvenue', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: /bienvenue/i })).toBeInTheDocument()
  })

  it('affiche le paragraphe d’accueil', () => {
    render(<HomePage />)
    expect(screen.getByText(/bienvenue sur le site vitrine d'imagiro/i)).toBeInTheDocument()
  })
})
