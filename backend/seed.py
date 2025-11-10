#!/usr/bin/env python
"""
Script para popular o banco de dados com usuários e carros de teste.

Uso:
    python seed.py

Usuários criados:
    - prof@admin.com / admin123
    - aluno1@user.com / user123
    - aluno2@user.com / user123
    - aluno3@user.com / user123
"""

import sys
import os
import re
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app, db, Usuario, Carro
except ImportError as e:
    print(f"Erro ao importar app: {str(e)}")
    print("Certifique-se de que as dependências foram instaladas:")
    print("  pip install -r requirements.txt")
    sys.exit(1)


# ============================================================
# USUÁRIOS DE TESTE
# ============================================================

USUARIOS_TESTE = [
    {"nome": "Prof Rodrigo", "email": "prof@admin.com", "senha": "admin123"},
    {"nome": "Ana Vitória", "email": "aluno1@user.com", "senha": "user123"},
    {"nome": "Anderson Freitas", "email": "aluno2@user.com", "senha": "user123"},
    {"nome": "Enzo Souto", "email": "aluno3@user.com", "senha": "user123"},
]


# ============================================================
# CARROS DE TESTE (formato original manteve "nome" para compatibilidade)
# ============================================================

CARROS_TESTE = [
    {
        'nome': 'Toyota Corolla 2022',
        'descricao': 'Sedã médio com motor 2.0, câmbio CVT, completo e econômico.',
        'preco': 125000.00,
        'imagem_url': 'https://images.unsplash.com/photo-1614200187524-dc4b2f0c7caa?w=400',
        'ativo': True
    },
    {
        'nome': 'Honda Civic Touring 2021',
        'descricao': 'Motor turbo 1.5, teto solar, bancos em couro, excelente desempenho.',
        'preco': 139000.00,
        'imagem_url': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
        'ativo': True
    },
    {
        'nome': 'Chevrolet Onix LTZ 2023',
        'descricao': 'Hatch moderno com conectividade total e motor 1.0 turbo.',
        'preco': 98900.00,
        'imagem_url': 'https://images.unsplash.com/photo-1592853625601-3a5c9b21c63b?w=400',
        'ativo': True
    },
    {
        'nome': 'Fiat Pulse Audace 2023',
        'descricao': 'SUV compacto com design arrojado e motor turbo 200 flex.',
        'preco': 112500.00,
        'imagem_url': 'https://images.unsplash.com/photo-1632813106629-6d69bba3ad96?w=400',
        'ativo': True
    },
    {
        'nome': 'Volkswagen T-Cross Highline 2022',
        'descricao': 'SUV 1.4 TSI automático, interior premium e painel digital.',
        'preco': 134900.00,
        'imagem_url': 'https://images.unsplash.com/photo-1616781383656-23ec4c8cfb7c?w=400',
        'ativo': True
    },
    {
        'nome': 'Jeep Compass Limited 2023',
        'descricao': 'SUV médio com tração 4x4, acabamento refinado e motor 1.3 turbo.',
        'preco': 179000.00,
        'imagem_url': 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400',
        'ativo': True
    },
    {
        'nome': 'Tesla Model 3 Performance 2024',
        'descricao': 'Sedã elétrico com autonomia de 530 km e aceleração impressionante.',
        'preco': 349000.00,
        'imagem_url': 'https://images.unsplash.com/photo-1549921296-3ecf47f8c41f?w=400',
        'ativo': True
    },
    {
        'nome': 'BMW 320i Sport GP 2022',
        'descricao': 'Sedã premium com motor 2.0 turbo e interior de luxo.',
        'preco': 259000.00,
        'imagem_url': 'https://images.unsplash.com/photo-1604251408760-6c1ef4276f77?w=400',
        'ativo': True
    },
    {
        'nome': 'Audi Q3 2022',
        'descricao': 'SUV de luxo, motor 2.0 TFSI, tração quattro e conforto premium.',
        'preco': 289000.00,
        'imagem_url': 'https://images.unsplash.com/photo-1616442944625-12cf66b1caa2?w=400',
        'ativo': True
    },
    {
        'nome': 'Ford Maverick Lariat FX4 2023',
        'descricao': 'Picape híbrida com estilo urbano e motor 2.5 híbrido flex.',
        'preco': 214900.00,
        'imagem_url': 'https://images.unsplash.com/photo-1634999111462-5305109b6b2d?w=400',
        'ativo': True
    },
]


# ============================================================
# AUX: parsing "nome" -> marca, modelo, ano
# ============================================================

def parse_nome_para_marca_modelo_ano(nome):
    """
    Tenta extrair marca, modelo e ano do campo 'nome' que vem como:
      "Marca Modelo [submodelo] <ANO>"
    Estratégia simples:
      - se o último token for um ano (4 dígitos entre 1900 e 2099), usa como ano
      - marca = primeiro token
      - modelo = tokens do meio (sem o ano)
    Retorna (marca, modelo, ano_or_None)
    """
    if not nome or not isinstance(nome, str):
        return None, None, None

    tokens = nome.strip().split()
    ano = None

    # checar se último token é ano
    last = tokens[-1]
    if re.fullmatch(r'\d{4}', last):
        try:
            ano_int = int(last)
            if 1900 <= ano_int <= 2099:
                ano = ano_int
                tokens = tokens[:-1]
        except ValueError:
            ano = None

    if len(tokens) == 0:
        return None, None, ano

    marca = tokens[0]
    modelo = ' '.join(tokens[1:]) if len(tokens) > 1 else ''

    return marca, modelo, ano


# ============================================================
# FUNÇÕES DE POPULAÇÃO
# ============================================================

def seed_database():
    print("Populando banco de dados com usuários e carros de teste...")
    print("-" * 50)

    with app.app_context():
        try:
            db.create_all()

            usuario_count = Usuario.query.count()
            carro_count = Carro.query.count()

            if usuario_count > 0 or carro_count > 0:
                print("Aviso: Banco de dados já está populado.")
                print(f"Usuários existentes: {usuario_count}")
                print(f"Carros existentes: {carro_count}")
                print("\nPara resetar o banco:")
                print("  1. Delete o arquivo do banco (ex: 'usuarios.db')")
                print("  2. Execute este script novamente")
                return False

            # Criar usuários
            print(f"\nCriando {len(USUARIOS_TESTE)} usuários de teste...")
            usuarios_criados = []
            for dados in USUARIOS_TESTE:
                usuario = Usuario(nome=dados['nome'], email=dados['email'])
                usuario.set_password(dados['senha'])
                db.session.add(usuario)
                usuarios_criados.append(usuario)
                print(f"  + {dados['nome']} ({dados['email']})")

            db.session.commit()

            # Criar carros
            print(f"\nCriando {len(CARROS_TESTE)} carros de teste...")
            admin = usuarios_criados[0]  # Prof Rodrigo

            for carro_data in CARROS_TESTE:
                # Preferir campos explícitos (marca/modelo/ano) se existirem.
                marca = carro_data.get('marca')
                modelo = carro_data.get('modelo')
                ano = carro_data.get('ano')

                # Se não vierem, tentar extrair do campo 'nome'
                if not marca or not modelo or not ano:
                    nome_raw = carro_data.get('nome', '')
                    parsed_marca, parsed_modelo, parsed_ano = parse_nome_para_marca_modelo_ano(nome_raw)
                    if not marca and parsed_marca:
                        marca = parsed_marca
                    if not modelo and parsed_modelo:
                        modelo = parsed_modelo
                    if not ano and parsed_ano:
                        ano = parsed_ano

                # Definir valores padrão se ainda faltarem
                if not marca:
                    marca = 'Desconhecida'
                if modelo is None:
                    modelo = ''
                if ano is None:
                    ano = 0  # ano desconhecido

                carro = Carro(
                    marca=marca,
                    modelo=modelo,
                    ano=int(ano) if isinstance(ano, (int, str)) and str(ano).isdigit() else 0,
                    preco=float(carro_data.get('preco', 0.0)),
                    cor=carro_data.get('cor'),
                    quilometragem=int(carro_data.get('quilometragem', 0)),
                    combustivel=carro_data.get('combustivel'),
                    cambio=carro_data.get('cambio'),
                    descricao=carro_data.get('descricao', ''),
                    imagem_url=carro_data.get('imagem_url'),
                    ativo=bool(carro_data.get('ativo', True)),
                    usuario_id=admin.id
                )
                db.session.add(carro)

            db.session.commit()

            print("\nBanco populado com sucesso!")
            print(f"Total de carros ativos: {Carro.query.filter_by(ativo=True).count()}")

            return True

        except Exception as e:
            db.session.rollback()
            print(f"Erro ao popular banco: {str(e)}")
            import traceback
            traceback.print_exc()
            return False


def exibir_usuarios():
    print("\nUsuários de teste disponíveis:")
    print("=" * 50)
    for i, usuario in enumerate(USUARIOS_TESTE, 1):
        print(f"\nUsuário {i}:")
        print(f"  Email: {usuario['email']}")
        print(f"  Senha: {usuario['senha']}")
    print("\n" + "=" * 50)


def main():
    print("\n" + "=" * 50)
    print("Seed Database - Loja de Carros 🚗")
    print("=" * 50 + "\n")

    sucesso = seed_database()

    if sucesso:
        exibir_usuarios()
        print("\nPróximos passos:")
        print("  1. Iniciar backend: python app.py")
        print("  2. Em outro terminal, iniciar frontend: npm run dev")
        print("  3. Acessar: http://localhost:5173")
        print("  4. Fazer login com as credenciais acima")
        print("  5. Explorar o painel de carros")
        print("\n" + "=" * 50)
        return 0
    else:
        print("\nFalha ao popular banco. Verifique os erros acima.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
