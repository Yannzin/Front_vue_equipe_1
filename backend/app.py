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

# =====================
# CONFIGURACOES
# =====================
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///usuarios.db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'chave-muito-secreta')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600)))

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ✅ Configuração única e correta de CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


# =====================
# HANDLERS JWT
# =====================

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'message': 'Token inválido ou expirado'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'message': 'Token de autorização não fornecido'}), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
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

   
    carros = db.relationship('Carro', backref='usuario', lazy=True, cascade='all, delete-orphan')

    def set_password(self, senha):
        self.senha = generate_password_hash(senha)

    def check_password(self, senha):
        return check_password_hash(self.senha, senha)

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }


# =====================
# NOVO MODEL: CARROS
# =====================

class Carro(db.Model):
    __tablename__ = 'carros'

    id = db.Column(db.Integer, primary_key=True)
    marca = db.Column(db.String(120), nullable=False)
    modelo = db.Column(db.String(120), nullable=False)
    ano = db.Column(db.Integer, nullable=False)
    preco = db.Column(db.Float, nullable=False)
    cor = db.Column(db.String(50))
    quilometragem = db.Column(db.Integer, default=0)
    combustivel = db.Column(db.String(50))
    cambio = db.Column(db.String(50))
    descricao = db.Column(db.Text)
    imagem_url = db.Column(db.String(500))
    ativo = db.Column(db.Boolean, default=True)
    data_criacao = db.Column(db.DateTime, default=db.func.now())
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'marca': self.marca,
            'modelo': self.modelo,
            'ano': self.ano,
            'preco': float(self.preco),
            'cor': self.cor,
            'quilometragem': self.quilometragem,
            'combustivel': self.combustivel,
            'cambio': self.cambio,
            'descricao': self.descricao,
            'imagem_url': self.imagem_url,
            'ativo': self.ativo,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'usuario_id': self.usuario_id
        }

# =====================
# ROTAS DE CARROS (CRUD)
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




@app.route('/api/carros', methods=['GET'])
@jwt_required(locations=["headers"])
def listar_carros():
    try:
        marca = request.args.get('marca')
        modelo = request.args.get('modelo')
        ativo = request.args.get('ativo')

        query = Carro.query
        if marca:
            query = query.filter(Carro.marca.ilike(f'%{marca}%'))
        if modelo:
            query = query.filter(Carro.modelo.ilike(f'%{modelo}%'))
        if ativo is not None:
            query = query.filter(Carro.ativo == (ativo.lower() == 'true'))

        carros = query.order_by(Carro.data_criacao.desc()).all()
        return jsonify({'carros': [c.to_dict() for c in carros]}), 200

    except Exception as e:
        print(f'Erro ao listar carros: {str(e)}')
        return jsonify({'message': 'Erro ao listar carros'}), 500



@app.route('/api/carros/<int:carro_id>', methods=['GET'])
@jwt_required(locations=["headers"])
def buscar_carro(carro_id):
    try:
        carro = Carro.query.get(carro_id)
        if not carro:
            return jsonify({'message': 'Carro não encontrado'}), 404
        return jsonify(carro.to_dict()), 200
    except Exception as e:
        print(f'Erro ao buscar carro: {str(e)}')
        return jsonify({'message': 'Erro ao buscar carro'}), 500



@app.route('/api/carros', methods=['POST'])
@jwt_required(locations=["headers"])
def criar_carro():
    try:
        dados = request.get_json()
        usuario_id = get_jwt_identity()

        if not dados.get('marca') or not dados.get('modelo') or not dados.get('ano') or not dados.get('preco'):
            return jsonify({'message': 'Campos obrigatórios: marca, modelo, ano, preco'}), 400

        carro = Carro(
            marca=dados['marca'],
            modelo=dados['modelo'],
            ano=int(dados['ano']),
            preco=float(dados['preco']),
            cor=dados.get('cor'),
            quilometragem=dados.get('quilometragem', 0),
            combustivel=dados.get('combustivel'),
            cambio=dados.get('cambio'),
            descricao=dados.get('descricao', ''),
            imagem_url=dados.get('imagem_url'),
            ativo=dados.get('ativo', True),
            usuario_id=int(usuario_id)
        )

        db.session.add(carro)
        db.session.commit()
        return jsonify({'message': 'Carro cadastrado com sucesso', 'carro': carro.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        print(f'Erro ao criar carro: {str(e)}')
        return jsonify({'message': 'Erro ao criar carro'}), 500

@app.route('/api/carros/<int:carro_id>', methods=['PUT'])
@jwt_required(locations=["headers"])
def atualizar_carro(carro_id):
    try:
        dados = request.get_json()
        carro = Carro.query.get(carro_id)

        if not carro:
            return jsonify({'message': 'Carro não encontrado'}), 404

        campos_permitidos = ['marca', 'modelo', 'ano', 'preco', 'cor', 'quilometragem',
                              'combustivel', 'cambio', 'descricao', 'imagem_url', 'ativo']

        for campo in campos_permitidos:
            if campo in dados:
                valor = dados[campo]
                # Convertendo tipos específicos
                if campo in ['ano', 'quilometragem']:
                    valor = int(valor)
                if campo == 'preco':
                    valor = float(valor)
                if campo == 'ativo':
                    valor = bool(valor)
                setattr(carro, campo, valor)

        db.session.commit()
        return jsonify({'message': 'Carro atualizado com sucesso', 'carro': carro.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        print(f'Erro ao atualizar carro: {str(e)}')
        return jsonify({'message': 'Erro ao atualizar carro'}), 500

@app.route('/api/carros/<int:carro_id>', methods=['DELETE'])
@jwt_required(locations=["headers"])
def deletar_carro(carro_id):
    try:
        carro = Carro.query.get(carro_id)
        if not carro:
            return jsonify({'message': 'Carro não encontrado'}), 404

        db.session.delete(carro)
        db.session.commit()
        return jsonify({'message': 'Carro removido com sucesso'}), 200

    except Exception as e:
        db.session.rollback()
        print(f'Erro ao deletar carro: {str(e)}')
        return jsonify({'message': 'Erro ao deletar carro'}), 500




@app.route('/api/categorias', methods=['GET'])
def listar_categorias():
    """Retorna categorias fixas de carros"""
    categorias = [
        {"id": 1, "nome": "SUV"},
        {"id": 2, "nome": "Sedan"},
        {"id": 3, "nome": "Hatch"},
        {"id": 4, "nome": "Picape"},
        {"id": 5, "nome": "Conversível"},
        {"id": 6, "nome": "Esportivo"}
    ]
    return jsonify({"categorias": categorias}), 200



@app.route('/api/dashboard/atividades', methods=['GET'])
def listar_atividades_dashboard():
    atividades = [
        {"id": 1, "marca": "Toyota", "modelo": "Corolla", "data": "2025-11-10T18:00:00"},
        {"id": 2, "marca": "Fiat", "modelo": "Argo", "data": "2025-11-10T17:30:00"},
        {"id": 3, "marca": "Ford", "modelo": "Ranger", "data": "2025-11-09T15:00:00"}
    ]
    return jsonify({"atividades": atividades}), 200





# =====================
# MAIN
# =====================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    ##app.run(debug=True, host='0.0.0.0', port=5000)
    app.run(host="0.0.0.0", port=5000, debug=True)
