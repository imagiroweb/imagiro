import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Layout from './Layout.jsx'

describe('Layout', () => {
  it('affiche le header et le contenu enfant', () => {
    render(
      <Layout>
        <span data-testid="child">Contenu</span>
      </Layout>
    )
    expect(screen.getByRole('heading', { name: /imagiro/i })).toBeInTheDocument()
    expect(screen.getByTestId('child')).toHaveTextContent('Contenu')
  })

  it('affiche le footer', () => {
    render(<Layout><div>Body</div></Layout>)
    const footer = document.querySelector('footer.footer')
    expect(footer).toBeInTheDocument()
  })
})
