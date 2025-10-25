#!/usr/bin/env python
"""
Script para popular o banco de dados com usuarios de teste.

Uso:
    python seed.py

Usuarios criados:
    - prof@admin.com / admin123
    - aluno@user.com / user123

Requisitos:
    - Nenhum (usa apenas modulos built-in)
    - Funciona mesmo se o backend HTTP nao estiver rodando
"""

import sys
import os
from pathlib import Path

# Adicionar diretorio atual ao path para importar app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app, db, Usuario, Produto
    USAR_IMPORT_DIRETO = True
except ImportError as e:
    print(f"Erro ao importar app: {str(e)}")
    print("Certifique-se de que as dependencias foram instaladas:")
    print("  pip install -r requirements.txt")
    sys.exit(1)

# Dados dos usuarios de teste
USUARIOS_TESTE = [
    {
        "nome": "Prof Rodrigo",
        "email": "prof@admin.com",
        "senha": "admin123"
    },
    {
        "nome": "Ana Vitória",
        "email": "aluno1@user.com",
        "senha": "user123"
    },
    {
        "nome": "Anderson Freitas",
        "email": "aluno2@user.com",
        "senha": "user123"
    },
    {
        "nome": "Enzo Souto",
        "email": "aluno3@user.com",
        "senha": "user123"
    }
]

# Dados dos produtos de teste
PRODUTOS_TESTE = [
    # Eletronicos
    {
        'nome': 'Notebook Dell Inspiron 15',
        'descricao': 'Notebook com processador Intel Core i5, 8GB RAM, SSD 256GB',
        'preco': 3499.99,
        'estoque': 15,
        'categoria': 'Eletronicos',
        'imagem_url': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        'ativo': True
    },
    {
        'nome': 'Mouse Logitech MX Master 3',
        'descricao': 'Mouse wireless ergonomico com alta precisao',
        'preco': 449.90,
        'estoque': 30,
        'categoria': 'Eletronicos',
        'imagem_url': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
        'ativo': True
    },
    {
        'nome': 'Teclado Mecanico Keychron K2',
        'descricao': 'Teclado mecanico wireless 75% com switches Brown',
        'preco': 699.00,
        'estoque': 8,
        'categoria': 'Eletronicos',
        'imagem_url': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        'ativo': True
    },
    {
        'nome': 'Monitor LG UltraWide 29"',
        'descricao': 'Monitor ultrawide 29 polegadas Full HD IPS',
        'preco': 1299.99,
        'estoque': 12,
        'categoria': 'Eletronicos',
        'imagem_url': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        'ativo': True
    },
    {
        'nome': 'Webcam Logitech C920',
        'descricao': 'Webcam Full HD 1080p com microfone stereo',
        'preco': 399.00,
        'estoque': 5,
        'categoria': 'Eletronicos',
        'imagem_url': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400',
        'ativo': True
    },
    
    # Livros
    {
        'nome': 'Clean Code - Robert Martin',
        'descricao': 'Guia completo sobre como escrever codigo limpo e manutenivel',
        'preco': 89.90,
        'estoque': 25,
        'categoria': 'Livros',
        'imagem_url': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        'ativo': True
    },
    {
        'nome': 'The Pragmatic Programmer',
        'descricao': 'Classico sobre desenvolvimento de software pragmatico',
        'preco': 95.00,
        'estoque': 18,
        'categoria': 'Livros',
        'imagem_url': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
        'ativo': True
    },
    {
        'nome': 'Design Patterns - Gang of Four',
        'descricao': 'Padroes de projeto orientados a objetos',
        'preco': 110.00,
        'estoque': 10,
        'categoria': 'Livros',
        'imagem_url': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        'ativo': True
    },
    {
        'nome': 'JavaScript: The Good Parts',
        'descricao': 'Guia essencial sobre as melhores partes do JavaScript',
        'preco': 75.00,
        'estoque': 20,
        'categoria': 'Livros',
        'imagem_url': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        'ativo': True
    },
    
    # Escritorio
    {
        'nome': 'Cadeira Ergonomica FlexForm',
        'descricao': 'Cadeira de escritorio ergonomica com ajuste de altura e lombar',
        'preco': 899.00,
        'estoque': 7,
        'categoria': 'Escritorio',
        'imagem_url': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
        'ativo': True
    },
    {
        'nome': 'Mesa Escritorio Regulavel',
        'descricao': 'Mesa com altura regulavel eletrica, tampo 160x80cm',
        'preco': 1899.00,
        'estoque': 4,
        'categoria': 'Escritorio',
        'imagem_url': 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400',
        'ativo': True
    },
    {
        'nome': 'Luminaria LED de Mesa',
        'descricao': 'Luminaria LED com ajuste de intensidade e temperatura de cor',
        'preco': 199.90,
        'estoque': 15,
        'categoria': 'Escritorio',
        'imagem_url': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        'ativo': True
    },
    {
        'nome': 'Organizador de Mesa',
        'descricao': 'Organizador multicompartimento em madeira',
        'preco': 79.90,
        'estoque': 30,
        'categoria': 'Escritorio',
        'imagem_url': 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=400',
        'ativo': True
    },
    
    # Acessorios
    {
        'nome': 'Suporte para Notebook',
        'descricao': 'Suporte ergonomico ajustavel em aluminio',
        'preco': 149.00,
        'estoque': 20,
        'categoria': 'Acessorios',
        'imagem_url': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        'ativo': True
    },
    {
        'nome': 'Hub USB-C 7 em 1',
        'descricao': 'Hub com HDMI, USB 3.0, USB-C PD, leitor SD/microSD',
        'preco': 249.00,
        'estoque': 25,
        'categoria': 'Acessorios',
        'imagem_url': 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
        'ativo': True
    },
    {
        'nome': 'Mouse Pad Gaming XL',
        'descricao': 'Mouse pad extra grande 900x400mm com borda costurada',
        'preco': 89.90,
        'estoque': 35,
        'categoria': 'Acessorios',
        'imagem_url': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400',
        'ativo': True
    },
    {
        'nome': 'Fone Bluetooth Sony WH-1000XM4',
        'descricao': 'Fone over-ear com cancelamento de ruido ativo',
        'preco': 1499.00,
        'estoque': 6,
        'categoria': 'Acessorios',
        'imagem_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        'ativo': True
    },
    {
        'nome': 'Suporte para Monitor Duplo',
        'descricao': 'Braco articulado para dois monitores ate 27 polegadas',
        'preco': 399.00,
        'estoque': 9,
        'categoria': 'Acessorios',
        'imagem_url': 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400',
        'ativo': True
    },
    
    # Cursos
    {
        'nome': 'Curso Vue.js Completo',
        'descricao': 'Curso completo de Vue.js do basico ao avancado',
        'preco': 199.00,
        'estoque': 100,
        'categoria': 'Cursos',
        'imagem_url': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        'ativo': True
    },
    {
        'nome': 'Masterclass JavaScript Moderno',
        'descricao': 'JavaScript ES6+ com projetos praticos',
        'preco': 249.00,
        'estoque': 100,
        'categoria': 'Cursos',
        'imagem_url': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        'ativo': True
    },
    {
        'nome': 'Python para Data Science',
        'descricao': 'Aprenda Python focado em analise de dados',
        'preco': 299.00,
        'estoque': 100,
        'categoria': 'Cursos',
        'imagem_url': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
        'ativo': True
    },
    
    # Produtos inativos (para teste)
    {
        'nome': 'Produto Descontinuado',
        'descricao': 'Este produto nao esta mais disponivel',
        'preco': 99.99,
        'estoque': 0,
        'categoria': 'Outros',
        'imagem_url': None,
        'ativo': False
    }
]


def seed_database():
    """
    Popular banco diretamente importando a aplicacao Flask
    """
    print("Populando banco de dados com usuarios e produtos de teste...")
    print("-" * 50)
    
    with app.app_context():
        try:
            # Criar tabelas se nao existirem
            db.create_all()
            
            # Verificar se ja tem usuarios
            usuario_count = Usuario.query.count()
            produto_count = Produto.query.count()
            
            if usuario_count > 0 or produto_count > 0:
                print("Aviso: Banco de dados ja estava populado.")
                print(f"Usuarios existentes: {usuario_count}")
                print(f"Produtos existentes: {produto_count}")
                print("\nPara resetar o banco:")
                print("  1. Delete o arquivo 'usuarios.db'")
                print("  2. Execute este script novamente")
                return False
            
            # Criar usuarios
            print(f"\nCriando {len(USUARIOS_TESTE)} usuarios de teste...")
            
            usuarios_criados = []
            for dados in USUARIOS_TESTE:
                usuario = Usuario(
                    nome=dados['nome'],
                    email=dados['email']
                )
                usuario.set_password(dados['senha'])
                db.session.add(usuario)
                usuarios_criados.append(usuario)
                print(f"  + {dados['nome']} ({dados['email']})")
            
            db.session.commit()
            
            # Criar produtos (associados ao primeiro usuario - admin)
            print(f"\nCriando {len(PRODUTOS_TESTE)} produtos de teste...")
            admin = usuarios_criados[0]  # Prof Rodrigo
            
            for produto_data in PRODUTOS_TESTE:
                produto = Produto(
                    nome=produto_data['nome'],
                    descricao=produto_data['descricao'],
                    preco=produto_data['preco'],
                    estoque=produto_data['estoque'],
                    categoria=produto_data['categoria'],
                    imagem_url=produto_data['imagem_url'],
                    ativo=produto_data['ativo'],
                    usuario_id=admin.id
                )
                db.session.add(produto)
            
            db.session.commit()
            
            # Exibir resumo
            print("\n" + "-" * 50)
            print("Sucesso! Banco de dados populado.")
            print(f"\nProdutos criados por categoria:")
            
            categorias = db.session.query(Produto.categoria).distinct().all()
            for cat in categorias:
                count = Produto.query.filter_by(categoria=cat[0], ativo=True).count()
                print(f"  - {cat[0]}: {count} produtos ativos")
            
            total_ativos = Produto.query.filter_by(ativo=True).count()
            total_inativos = Produto.query.filter_by(ativo=False).count()
            print(f"\nTotal: {total_ativos} ativos, {total_inativos} inativos")
            
            return True
        
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao popular banco: {str(e)}")
            import traceback
            traceback.print_exc()
            return False


def exibir_usuarios():
    """
    Exibir usuarios criados
    """
    print("\nUsuarios de teste disponiveis:")
    print("=" * 50)
    for i, usuario in enumerate(USUARIOS_TESTE, 1):
        print(f"\nUsuario {i}:")
        print(f"  Email: {usuario['email']}")
        print(f"  Senha: {usuario['senha']}")
    print("\n" + "=" * 50)


def main():
    """
    Funcao principal
    """
    print("\n" + "=" * 50)
    print("Seed Database - Aula 12 Projeto Final")
    print("=" * 50 + "\n")
    
    sucesso = seed_database()
    
    if sucesso:
        exibir_usuarios()
        print("\nProximos passos:")
        print("  1. Iniciar backend: python app.py")
        print("  2. Em outro terminal, iniciar frontend: npm run dev")
        print("  3. Acessar: http://localhost:5173")
        print("  4. Fazer login com as credenciais acima")
        print("  5. Explorar dashboard e produtos")
        print("\n" + "=" * 50)
        return 0
    else:
        print("\n" + "=" * 50)
        print("Falha ao popular banco. Verifique os erros acima.")
        print("=" * 50)
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)

