import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projetos from './pages/Projetos'
import ProjetoPage from './pages/ProjetoPage'
import Tarefas from './pages/Tarefas'
import Membros from './pages/Membros'
import { DataProvider } from './lib/data'

function App() {
  return (
    <Router>
      <DataProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/projetos/:id" element={<ProjetoPage />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/minhas" element={<Tarefas mine key="minhas" />} />
            <Route path="/membros" element={<Membros />} />
          </Routes>
        </Layout>
        <Toaster position="bottom-right" richColors closeButton />
      </DataProvider>
    </Router>
  )
}

export default App
