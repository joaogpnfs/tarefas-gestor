import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Projetos from './pages/Projetos'
import ProjetoDetail from './pages/ProjetoDetail'
import Tarefas from './pages/Tarefas'
import Membros from './pages/Membros'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/projetos/:id" element={<ProjetoDetail />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/membros" element={<Membros />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  )
}

export default App
