import { render, screen } from "@testing-library/react"
import ButtonApp from "../../../Components/Common/Button"

test('Testeo que ButtonApp por defecto sea de tipo button', () => { 
    render(<ButtonApp variant='danger'>Eliminar la bolsa</ButtonApp>) 

    const button = screen.getByText(/eliminar/i)

    //expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute("type", "button")
})

test('Testeo que ButtonApp por tenga el tipo que espero', () => { 
    render(<ButtonApp variant='danger' type="submit">Eliminar la bolsa</ButtonApp>) 

    const button = screen.getByText(/eliminar/i)

    //expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute("type", "submit")
})