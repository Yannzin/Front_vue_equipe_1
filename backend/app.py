from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuracoes
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///usuarios.db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'chave-muito-secreta')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600)))

# Inicializar extensoes
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# =====================
# HANDLERS JWT
# =====================

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(f'[DEBUG] Invalid token: {str(error)}')
    return jsonify({'message': 'Token invalido ou expirado'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    print(f'[DEBUG] Missing token: {str(error)}')
    return jsonify({'message': 'Token de autorizacao nao fornecido'}), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    print(f'[DEBUG] Token expirado')
    return jsonify({'message': 'Token expirado'}), 401

# =====================
# MODELS
# =====================

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    data_criacao = db.Column(db.DateTime, default=db.func.now())
    
    # Relacionamento com produtos
    produtos = db.relationship('Produto', backref='usuario', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, senha):
        """Hash da senha antes de armazenar"""
        self.senha = generate_password_hash(senha)
    
    def check_password(self, senha):
        """Verifica se a senha fornecida corresponde ao hash armazenado"""
        return check_password_hash(self.senha, senha)
    
    def to_dict(self):
        """Converte usuario para dicionario (sem expor a senha)"""
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }


class Produto(db.Model):
    __tablename__ = 'produtos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text)
    preco = db.Column(db.Float, nullable=False)
    estoque = db.Column(db.Integer, default=0)
    categoria = db.Column(db.String(100))
    imagem_url = db.Column(db.String(500))
    ativo = db.Column(db.Boolean, default=True)
    data_criacao = db.Column(db.DateTime, default=db.func.now())
    data_atualizacao = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    
    def to_dict(self):
        """Converte produto para dicionario"""
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'preco': float(self.preco) if self.preco else 0,
            'estoque': self.estoque,
            'categoria': self.categoria,
            'imagem_url': self.imagem_url,
            'ativo': self.ativo,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'usuario_id': self.usuario_id
        }

# =====================
# ROTAS DE AUTENTICACAO
# =====================

@app.route('/login', methods=['POST'])
def login():
    """
    Endpoint para login do usuario.
    
    Request JSON:
    {
        "email": "prof@admin.com",
        "senha": "admin123"
    }
    
    Response (sucesso):
    {
        "access_token": "eyJ0eXAiOiJKV1QiLC...",
        "user": {
            "id": 1,
            "nome": "Prof Admin",
            "email": "prof@admin.com"
        }
    }
    
    Response (erro 401):
    {
        "message": "Email ou senha incorretos."
    }
    """
    try:
        dados = request.get_json()
        
        if not dados or not dados.get('email') or not dados.get('senha'):
            return jsonify({'message': 'Email e senha sao obrigatorios'}), 400
        
        usuario = Usuario.query.filter_by(email=dados['email']).first()
        
        if not usuario or not usuario.check_password(dados['senha']):
            return jsonify({'message': 'Email ou senha incorretos.'}), 401
        
        # Gerar JWT token
        access_token = create_access_token(identity=str(usuario.id))
        
        return jsonify({
            'access_token': access_token,
            'user': usuario.to_dict()
        }), 200
    
    except Exception as e:
        print(f'Erro no login: {str(e)}')
        return jsonify({'message': 'Erro interno do servidor'}), 500


@app.route('/form', methods=['POST'])
def cadastro():
    """
    Endpoint para cadastro de novo usuario.
    
    Request JSON:
    {
        "nome": "Aluno User",
        "email": "aluno@user.com",
        "senha": "user123"
    }
    
    Response (sucesso):
    {
        "message": "Usuario criado com sucesso",
        "user": {
            "id": 2,
            "nome": "Aluno User",
            "email": "aluno@user.com"
        }
    }
    
    Response (erro 422):
    {
        "message": "Email ja registrado"
    }
    """
    try:
        dados = request.get_json()
        
        if not dados or not dados.get('nome') or not dados.get('email') or not dados.get('senha'):
            return jsonify({'message': 'Nome, email e senha sao obrigatorios'}), 400
        
        if len(dados['senha']) < 6:
            return jsonify({'message': 'Senha deve ter pelo menos 6 caracteres'}), 400
        
        if Usuario.query.filter_by(email=dados['email']).first():
            return jsonify({'message': 'Email ja registrado'}), 422
        
        novo_usuario = Usuario(
            nome=dados['nome'],
            email=dados['email']
        )
        novo_usuario.set_password(dados['senha'])
        
        db.session.add(novo_usuario)
        db.session.commit()
        
        return jsonify({
            'message': 'Usuario criado com sucesso',
            'user': novo_usuario.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro no cadastro: {str(e)}')
        return jsonify({'message': 'Erro ao criar usuario'}), 500


@app.route('/api/perfil', methods=['GET'])
@jwt_required(locations=["headers"])
def obter_perfil():
    """
    Endpoint protegido para obter dados do perfil do usuario logado.
    Requer token JWT no header Authorization: Bearer <token>
    
    Response:
    {
        "id": 1,
        "nome": "Prof Admin",
        "email": "prof@admin.com",
        "data_criacao": "2025-10-24T10:30:00"
    }
    """
    try:
        # Debug: verificar token
        auth_header = request.headers.get('Authorization', 'Nao fornecido')
        print(f'[DEBUG] Authorization header: {auth_header[:50]}...' if len(auth_header) > 50 else f'[DEBUG] Authorization header: {auth_header}')
        
        usuario_id = get_jwt_identity()
        print(f'[DEBUG] JWT identity extraido: {usuario_id}')
        
        usuario = Usuario.query.get(int(usuario_id))
        
        if not usuario:
            return jsonify({'message': 'Usuario nao encontrado'}), 404
        
        return jsonify(usuario.to_dict()), 200
    
    except Exception as e:
        print(f'Erro ao obter perfil: {str(e)}')
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Erro ao obter perfil'}), 500


# =====================
# ROTA DE TESTE
# =====================

@app.route('/health', methods=['GET'])
def health():
    """Endpoint para verificar se o servidor esta rodando"""
    return jsonify({'status': 'ok', 'message': 'Backend Flask rodando'}), 200


# =====================
# ROTAS DE PRODUTOS (CRUD)
# =====================

@app.route('/api/produtos', methods=['GET'])
@jwt_required(locations=["headers"])
def listar_produtos():
    """
    Lista todos os produtos com filtros opcionais
    
    Query params:
    - categoria: filtro por categoria
    - busca: busca por nome
    - ativo: filtro por ativo (true/false)
    - ordenar: campo para ordenacao (nome, preco, data)
    - ordem: asc ou desc
    """
    try:
        # Obter parametros de query
        categoria = request.args.get('categoria')
        busca = request.args.get('busca')
        ativo = request.args.get('ativo')
        ordenar = request.args.get('ordenar', 'data_criacao')
        ordem = request.args.get('ordem', 'desc')
        
        # Query base
        query = Produto.query
        
        # Aplicar filtros
        if categoria:
            query = query.filter(Produto.categoria == categoria)
        
        if busca:
            query = query.filter(Produto.nome.ilike(f'%{busca}%'))
        
        if ativo is not None:
            query = query.filter(Produto.ativo == (ativo.lower() == 'true'))
        
        # Aplicar ordenacao
        if ordenar == 'nome':
            campo_ordem = Produto.nome
        elif ordenar == 'preco':
            campo_ordem = Produto.preco
        else:
            campo_ordem = Produto.data_criacao
        
        if ordem == 'asc':
            query = query.order_by(campo_ordem.asc())
        else:
            query = query.order_by(campo_ordem.desc())
        
        produtos = query.all()
        
        return jsonify({
            'produtos': [p.to_dict() for p in produtos],
            'total': len(produtos)
        }), 200
    
    except Exception as e:
        print(f'Erro ao listar produtos: {str(e)}')
        return jsonify({'message': 'Erro ao listar produtos'}), 500


@app.route('/api/produtos/<int:produto_id>', methods=['GET'])
@jwt_required(locations=["headers"])
def buscar_produto(produto_id):
    """Busca um produto especifico por ID"""
    try:
        produto = Produto.query.get(produto_id)
        
        if not produto:
            return jsonify({'message': 'Produto nao encontrado'}), 404
        
        return jsonify(produto.to_dict()), 200
    
    except Exception as e:
        print(f'Erro ao buscar produto: {str(e)}')
        return jsonify({'message': 'Erro ao buscar produto'}), 500


@app.route('/api/produtos', methods=['POST'])
@jwt_required(locations=["headers"])
def criar_produto():
    """
    Cria um novo produto
    
    Request JSON:
    {
        "nome": "Produto Teste",
        "descricao": "Descricao do produto",
        "preco": 99.99,
        "estoque": 10,
        "categoria": "Eletronicos",
        "imagem_url": "https://...",
        "ativo": true
    }
    """
    try:
        dados = request.get_json()
        usuario_id = get_jwt_identity()
        
        # Validacoes
        if not dados.get('nome'):
            return jsonify({'message': 'Nome e obrigatorio'}), 400
        
        if not dados.get('preco'):
            return jsonify({'message': 'Preco e obrigatorio'}), 400
        
        if dados['preco'] < 0:
            return jsonify({'message': 'Preco deve ser positivo'}), 400
        
        # Criar produto
        novo_produto = Produto(
            nome=dados['nome'],
            descricao=dados.get('descricao', ''),
            preco=dados['preco'],
            estoque=dados.get('estoque', 0),
            categoria=dados.get('categoria', 'Outros'),
            imagem_url=dados.get('imagem_url'),
            ativo=dados.get('ativo', True),
            usuario_id=int(usuario_id)
        )
        
        db.session.add(novo_produto)
        db.session.commit()
        
        return jsonify({
            'message': 'Produto criado com sucesso',
            'produto': novo_produto.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao criar produto: {str(e)}')
        return jsonify({'message': 'Erro ao criar produto'}), 500


@app.route('/api/produtos/<int:produto_id>', methods=['PUT'])
@jwt_required(locations=["headers"])
def atualizar_produto(produto_id):
    """Atualiza um produto existente"""
    try:
        dados = request.get_json()
        produto = Produto.query.get(produto_id)
        
        if not produto:
            return jsonify({'message': 'Produto nao encontrado'}), 404
        
        # Atualizar campos
        if 'nome' in dados:
            produto.nome = dados['nome']
        if 'descricao' in dados:
            produto.descricao = dados['descricao']
        if 'preco' in dados:
            if dados['preco'] < 0:
                return jsonify({'message': 'Preco deve ser positivo'}), 400
            produto.preco = dados['preco']
        if 'estoque' in dados:
            produto.estoque = dados['estoque']
        if 'categoria' in dados:
            produto.categoria = dados['categoria']
        if 'imagem_url' in dados:
            produto.imagem_url = dados['imagem_url']
        if 'ativo' in dados:
            produto.ativo = dados['ativo']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Produto atualizado com sucesso',
            'produto': produto.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao atualizar produto: {str(e)}')
        return jsonify({'message': 'Erro ao atualizar produto'}), 500


@app.route('/api/produtos/<int:produto_id>', methods=['DELETE'])
@jwt_required(locations=["headers"])
def deletar_produto(produto_id):
    """Deleta um produto"""
    try:
        produto = Produto.query.get(produto_id)
        
        if not produto:
            return jsonify({'message': 'Produto nao encontrado'}), 404
        
        db.session.delete(produto)
        db.session.commit()
        
        return jsonify({'message': 'Produto deletado com sucesso'}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao deletar produto: {str(e)}')
        return jsonify({'message': 'Erro ao deletar produto'}), 500


# =====================
# ROTAS DE DASHBOARD
# =====================

@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required(locations=["headers"])
def dashboard_stats():
    """Retorna estatisticas gerais do sistema"""
    try:
        total_produtos = Produto.query.count()
        produtos_ativos = Produto.query.filter_by(ativo=True).count()
        produtos_inativos = total_produtos - produtos_ativos
        
        # Calcular valor total em estoque
        produtos = Produto.query.filter_by(ativo=True).all()
        valor_total = sum(p.preco * p.estoque for p in produtos)
        
        # Produtos com estoque baixo (menos de 10)
        estoque_baixo = Produto.query.filter(Produto.estoque < 10, Produto.ativo == True).count()
        
        # Produtos por categoria
        categorias = db.session.query(
            Produto.categoria,
            db.func.count(Produto.id).label('total')
        ).group_by(Produto.categoria).all()
        
        produtos_por_categoria = [
            {'categoria': cat, 'total': total}
            for cat, total in categorias
        ]
        
        return jsonify({
            'total_produtos': total_produtos,
            'produtos_ativos': produtos_ativos,
            'produtos_inativos': produtos_inativos,
            'valor_total_estoque': float(valor_total),
            'produtos_estoque_baixo': estoque_baixo,
            'produtos_por_categoria': produtos_por_categoria
        }), 200
    
    except Exception as e:
        print(f'Erro ao buscar estatisticas: {str(e)}')
        return jsonify({'message': 'Erro ao buscar estatisticas'}), 500


@app.route('/api/dashboard/atividades', methods=['GET'])
@jwt_required(locations=["headers"])
def dashboard_atividades():
    """Retorna atividades recentes (ultimos produtos criados/atualizados)"""
    try:
        # Ultimos 10 produtos criados
        produtos_recentes = Produto.query.order_by(
            Produto.data_criacao.desc()
        ).limit(10).all()
        
        atividades = [
            {
                'tipo': 'criacao',
                'produto': p.to_dict(),
                'data': p.data_criacao.isoformat()
            }
            for p in produtos_recentes
        ]
        
        return jsonify({'atividades': atividades}), 200
    
    except Exception as e:
        print(f'Erro ao buscar atividades: {str(e)}')
        return jsonify({'message': 'Erro ao buscar atividades'}), 500


@app.route('/api/categorias', methods=['GET'])
@jwt_required(locations=["headers"])
def listar_categorias():
    """Lista todas as categorias unicas"""
    try:
        categorias = db.session.query(Produto.categoria).distinct().all()
        categorias_lista = [cat[0] for cat in categorias if cat[0]]
        
        return jsonify({'categorias': categorias_lista}), 200
    
    except Exception as e:
        print(f'Erro ao listar categorias: {str(e)}')
        return jsonify({'message': 'Erro ao listar categorias'}), 500


# =====================
# MANIPULADORES DE ERRO
# =====================

@app.errorhandler(404)
def nao_encontrado(error):
    return jsonify({'message': 'Recurso nao encontrado'}), 404


@app.errorhandler(500)
def erro_interno(error):
    return jsonify({'message': 'Erro interno do servidor'}), 500


# =====================
# CRIAR BANCO DE DADOS E EXECUTAR APP
# =====================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
