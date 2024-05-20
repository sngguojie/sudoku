import { render, screen } from '@testing-library/react'
import React from 'react'
import App from './App'

describe("App", () => {
  test("renders", () => {
    render(<App/>)
    expect(screen.findByText("Sudoku")).toBeInTheDocument()
  })
})