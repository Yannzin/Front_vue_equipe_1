// services/CarroService.js
import { get, post, put, del } from './api'

// Mock de carros para ambiente de desenvolvimento
const MOCK_CARROS = [
  {
    id: 1,
    modelo: 'Ford Mustang GT',
    descricao: 'Motor V8 5.0L, icônico carro esportivo americano.',
    preco: 350000.00,
    estoque: 5,
    categoria: 'Esportivo',
    imagem_url: 'https://www.motortrend.com/uploads/2022/09/2024-ford-mustang-dark-horse-driver-side-front-three-quater.jpg',
    ativo: true
  },
  {
    id: 2,
    modelo: 'BMW M3 Competition',
    descricao: 'Sedã esportivo de alta performance com motor TwinPower Turbo.',
    preco: 580000.00,
    estoque: 2,
    categoria: 'Sedan',
    imagem_url: 'https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/01/2024-m3-cs.jpg',
    ativo: true
  },
  {
    id: 3,
    modelo: 'Toyota Corolla Cross',
    descricao: 'SUV híbrido, econômico e confiável, ideal para o dia a dia.',
    preco: 180000.00,
    estoque: 12,
    categoria: 'SUV',
    imagem_url: 'https://topelectricsuv.com/wp-content/uploads/2023/09/New-Toyota-Corolla-Cross-Hybrid-facelift-front-three-quarter-right-side-live-image.jpg',
    ativo: true
  },
  {
    id: 4,
    modelo: 'Honda Civic Type-R 2025',
    descricao: 'O sedan é uma opção para quem procura um modelo potente, estiloso e surpreendente.',
    preco: 429900.00,
    estoque: 25,
    categoria: 'Compacto',
    imagem_url: 'https://p4.wallpaperbetter.com/wallpaper/372/529/196/honda-civic-type-r-4k-high-def-for-mac-wallpaper-preview.jpg',
    ativo: true
  },
]

class CarroService {
  // Simula listagem com filtros e ordenação (modo mock)
  async listarCarros(filtros = {}) {


    // Simula latência da API
    await new Promise(resolve => setTimeout(resolve, 300))

    let carrosFiltrados = [...MOCK_CARROS]


    // 🔍 Filtro de busca
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase()
      carrosFiltrados = carrosFiltrados.filter(c =>
        c.modelo.toLowerCase().includes(busca) ||
        c.descricao.toLowerCase().includes(busca)
      )
    }

    // 🏷️ Filtro de categoria
    if (filtros.categoria) {
      carrosFiltrados = carrosFiltrados.filter(c => c.categoria === filtros.categoria)
    }

    // 🔄 Filtro de ativo/inativo
    if (filtros.ativo !== undefined) {
      carrosFiltrados = carrosFiltrados.filter(c => c.ativo === filtros.ativo)
    }

    // ↕️ Ordenação
    if (filtros.ordenar === 'preco') {
      carrosFiltrados.sort((a, b) =>
        filtros.ordem === 'asc' ? a.preco - b.preco : b.preco - a.preco
      )
    } else if (filtros.ordenar === 'modelo') {
      carrosFiltrados.sort((a, b) =>
        filtros.ordem === 'asc' ? a.modelo.localeCompare(b.modelo) : b.modelo.localeCompare(a.modelo)
      )
    }

    // ⚙️ Retorno compatível com o store
    return {
      carros: carrosFiltrados,
      total: carrosFiltrados.length
    }
  }

  async buscarCarro(id) {
    const carro = MOCK_CARROS.find(c => c.id === parseInt(id))
    if (carro) return carro
    try {
      const response = await get(`/api/carros/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async criarCarro(dados) {
    try {
      const response = await post('/api/carros', dados)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async atualizarCarro(id, dados) {
    try {
      const response = await put(`/api/carros/${id}`, dados)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async deletarCarro(id) {
    try {
      const response = await del(`/api/carros/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async alternarAtivo(id, ativo) {
    try {
      const response = await put(`/api/carros/${id}`, { ativo })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new CarroService()
