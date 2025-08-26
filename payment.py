from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False)
    corte = db.Column(db.Float, default=0)
    faccao = db.Column(db.Float, default=0)
    travet = db.Column(db.Float, default=0)
    ziper = db.Column(db.Float, default=0)
    botao = db.Column(db.Float, default=0)
    aprontamento = db.Column(db.Float, default=0)
    lavanderia = db.Column(db.Float, default=0)
    bolsa = db.Column(db.Float, default=0)
    limpado = db.Column(db.Float, default=0)
    tag_etiqueta = db.Column(db.Float, default=0)
    metragem_tecido = db.Column(db.Float, default=0)
    preco_tecido = db.Column(db.Float, default=0)
    nome_tecido = db.Column(db.String(255))
    valor_prod = db.Column(db.Float, default=0)
    quantidade_pecas = db.Column(db.Integer, default=0)
    valor_pedido = db.Column(db.Float, default=0)
    pagamentos = db.Column(db.Text)
    comprovante_path = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'data': self.data.isoformat() if self.data else None,
            'corte': self.corte,
            'faccao': self.faccao,
            'travet': self.travet,
            'ziper': self.ziper,
            'botao': self.botao,
            'aprontamento': self.aprontamento,
            'lavanderia': self.lavanderia,
            'bolsa': self.bolsa,
            'limpado': self.limpado,
            'tag_etiqueta': self.tag_etiqueta,
            'metragem_tecido': self.metragem_tecido,
            'preco_tecido': self.preco_tecido,
            'nome_tecido': self.nome_tecido,
            'valor_prod': self.valor_prod,
            'quantidade_pecas': self.quantidade_pecas,
            'valor_pedido': self.valor_pedido,
            'pagamentos': self.pagamentos,
            'comprovante_path': self.comprovante_path,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

