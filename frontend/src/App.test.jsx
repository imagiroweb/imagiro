import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App.jsx'

describe('App', () => {
  it('affiche le layout avec le titre Imagiro', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /imagiro/i })).toBeInTheDocument()
  })

  it('affiche la section Bienvenue', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /bienvenue/i })).toBeInTheDocument()
    expect(screen.getByText(/bienvenue sur le site vitrine/i)).toBeInTheDocument()
  })
})
