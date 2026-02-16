import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './Header.jsx'

describe('Header', () => {
  it('affiche le titre Imagiro', () => {
    render(<Header />)
    expect(screen.getByRole('heading', { name: /imagiro/i })).toBeInTheDocument()
  })

  it('affiche le tagline', () => {
    render(<Header />)
    expect(screen.getByText(/site vitrine/i)).toBeInTheDocument()
  })
})
