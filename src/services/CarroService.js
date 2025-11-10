// services/CarroService.js
import { get, post, put, del } from './api'

class CarroService {
  // ✅ Usa a API real para listar carros
  async listarCarros(filtros = {}) {
    try {
      const response = await get('/api/carros', { params: filtros })
      
      // O backend deve retornar um array ou um objeto com { carros, total }
      if (Array.isArray(response.data)) {
        return {
          carros: response.data,
          total: response.data.length
        }
      }

      return {
        carros: response.data.carros || [],
        total: response.data.total || 0
      }
    } catch (error) {
      console.warn('⚠️ Falha ao buscar carros na API, usando mock:', error)

      // Fallback: dados mockados caso o backend esteja offline
      const MOCK_CARROS = [
        {
          id: 1,
          modelo: 'Ford Mustang GT',
          descricao: 'Motor V8 5.0L, icônico carro esportivo americano.',
          preco: 350000.0,
          estoque: 5,
          categoria: 'Esportivo',
          imagem_url:
            'https://www.motortrend.com/uploads/2022/09/2024-ford-mustang-dark-horse-driver-side-front-three-quater.jpg',
          ativo: true
        },
        {
          id: 2,
          modelo: 'BMW M3 Competition',
          descricao:
            'Sedã esportivo de alta performance com motor TwinPower Turbo.',
          preco: 580000.0,
          estoque: 2,
          categoria: 'Sedan',
          imagem_url:
            'https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/01/2024-m3-cs.jpg',
          ativo: true
        },
          {
          id: 3,
          modelo: 'Honda Civic Type-R 2025',
          descricao: 'O sedan é uma opção para quem procura um modelo potente, estiloso e surpreendente.',
          preco: 429900.00,
          estoque: 25,
          categoria: 'Sedan',
          imagem_url: 'https://p4.wallpaperbetter.com/wallpaper/372/529/196/honda-civic-type-r-4k-high-def-for-mac-wallpaper-preview.jpg',
          ativo: true
        },
      ]

      return {
        carros: MOCK_CARROS,
        total: MOCK_CARROS.length
      }
    }
  }

  async buscarCarro(id) {
    const response = await get(`/api/carros/${id}`)
    return response.data
  }

  async criarCarro(dados) {
    const response = await post('/api/carros', dados)
    return response.data
  }

  async atualizarCarro(id, dados) {
    const response = await put(`/api/carros/${id}`, dados)
    return response.data
  }

  async deletarCarro(id) {
    const response = await del(`/api/carros/${id}`)
    return response.data
  }

  async alternarAtivo(id, ativo) {
    const response = await put(`/api/carros/${id}`, { ativo })
    return response.data
  }
}

export default new CarroService()
