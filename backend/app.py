# Importações necessárias:
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import os
import traceback # Importação adicionada para melhor rastreamento de erro

# Configuração
app = Flask(__name__)
CORS(app)

# Configuração do banco de dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///auth_aula.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configuração do JWT
app.config['JWT_SECRET_KEY'] = 'uma-chave-secreta-forte-para-jwt' 
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
jwt = JWTManager(app)

# ==============================================================================
# Modelo de Dados
# ==============================================================================

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)

    def check_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)

    def to_dict(self):
        """Retorna uma representação de dicionário do usuário, omitindo a senha."""
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            # Formato ISO string para fácil conversão em JS
            'data_criacao': self.data_criacao.isoformat() 
        }

# ==============================================================================
# Endpoints de Autenticação (Login e Cadastro)
# ==============================================================================

@app.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    if not email or not senha:
        return jsonify({'message': 'Email e senha são obrigatórios'}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario and usuario.check_senha(senha):
        # Cria um token JWT usando o ID do usuário como identidade
        access_token = create_access_token(identity=usuario.id)
        return jsonify({
            'message': 'Login bem-sucedido',
            'access_token': access_token,
            'user': usuario.to_dict()
        }), 200
    
    return jsonify({'message': 'Email ou senha inválidos'}), 401

@app.route('/form', methods=['POST'])
def cadastrar_usuario():
    dados = request.get_json()
    nome = dados.get('nome')
    email = dados.get('email')
    senha = dados.get('senha')

    if not nome or len(nome) < 2:
        return jsonify({'message': 'Nome deve ter pelo menos 2 caracteres'}), 422
    if not email or not senha:
        return jsonify({'message': 'Email e senha são obrigatórios'}), 422

    if Usuario.query.filter_by(email=email).first():
        return jsonify({'message': 'Email já registrado'}), 422

    novo_usuario = Usuario(nome=nome, email=email)
    novo_usuario.set_senha(senha)

    try:
        db.session.add(novo_usuario)
        db.session.commit()
        return jsonify({'message': 'Usuário criado com sucesso!'}), 201
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao cadastrar: {e}')
        return jsonify({'message': 'Erro ao registrar usuário'}), 500

# ==============================================================================
# Endpoints Protegidos
# ==============================================================================

@app.route('/api/perfil', methods=['GET'])
@jwt_required(locations=["headers"])
def obter_perfil():
    """Endpoint protegido para obter dados do perfil do usuario logado."""
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(int(usuario_id))
    
    if not usuario:
        return jsonify({'message': 'Usuario nao encontrado'}), 404
    
    return jsonify(usuario.to_dict()), 200

# Endpoint PUT /api/perfil (Para Edição)
@app.route('/api/perfil', methods=['PUT'])
@jwt_required(locations=["headers"])
def atualizar_perfil():
    """
    Endpoint protegido para atualizar dados do perfil do usuario logado.
    Requer token JWT no header Authorization: Bearer <token>
    """
    try:
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(int(usuario_id))
        
        if not usuario:
            return jsonify({'message': 'Usuario nao encontrado'}), 404
        
        dados = request.get_json()
        
        if not dados:
            return jsonify({'message': 'Dados invalidos'}), 400
        
        # Validar e atualizar nome
        if 'nome' in dados:
            if not dados['nome'] or len(dados['nome']) < 2:
                return jsonify({'message': 'Nome deve ter pelo menos 2 caracteres'}), 400
            usuario.nome = dados['nome']
        
        # Validar e atualizar email
        if 'email' in dados:
            novo_email = dados['email']
            if not novo_email:
                return jsonify({'message': 'Email eh obrigatorio'}), 400
            
            # Verificar se email ja existe (exceto o proprio usuario)
            usuario_existente = Usuario.query.filter_by(email=novo_email).first()
            if usuario_existente and usuario_existente.id != usuario.id:
                return jsonify({'message': 'Email ja registrado por outro usuario'}), 422
            
            usuario.email = novo_email
        
        db.session.commit()
        
        return jsonify({
            'message': 'Perfil atualizado com sucesso',
            'user': usuario.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao atualizar perfil: {str(e)}')
        traceback.print_exc()
        return jsonify({'message': 'Erro ao atualizar perfil'}), 500


# ==============================================================================
# Funções Auxiliares (Para seed.py)
# ==============================================================================

def init_db():
    """Cria o banco de dados e a tabela se não existirem."""
    if not os.path.exists('auth_aula.db'):
        with app.app_context():
            db.create_all()
            print("Banco de dados criado.")

# Chamada principal para rodar o Flask
if __name__ == '__main__':
    # init_db() # Não chame aqui se estiver usando seed.py
    app.run(debug=True)
