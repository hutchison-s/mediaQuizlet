import './App.css'
import { BrowserRouter } from 'react-router-dom'
import ReactRoutes from './Routes/Router'

function App() {

  return (
    <>
      <BrowserRouter>
        <ReactRoutes />
      </BrowserRouter>
    </>
  )
}

export default App
