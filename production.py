from flask import Blueprint, jsonify, request
from src.data_processor import DataProcessor
import os

production_bp = Blueprint("production", __name__)

# Caminho do arquivo JSON
JSON_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "productions.json")

# Inicializa o processador de dados
data_processor = DataProcessor(JSON_FILE)

@production_bp.route("/productions", methods=["GET"])
def get_productions():
    """Retorna todas as produções"""
    try:
        data = data_processor.load_json_data()
        return jsonify({
            "success": True,
            "data": data
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@production_bp.route("/productions/summary", methods=["GET"])
def get_production_summary():
    """Retorna resumo das produções"""
    try:
        summary = data_processor.get_production_summary()
        return jsonify({
            "success": True,
            "data": summary
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@production_bp.route("/productions/<production_id>", methods=["GET"])
def get_production_by_id(production_id):
    """Retorna uma produção específica"""
    try:
        data = data_processor.load_json_data()
        production = next((item for item in data if item.get("ID_PRODUCAO") == production_id), None)
        
        if production:
            return jsonify({
                "success": True,
                "data": production
            })
        else:
            return jsonify({
                "success": False,
                "error": "Produção não encontrada"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@production_bp.route("/productions", methods=["POST"])
def add_production():
    """Adiciona uma nova produção"""
    try:
        production_data = request.json
        
        # Validação básica
        required_fields = ["DATA", "NOME DO TECIDO", "QUANTIDADE DE PEÇAS"]
        for field in required_fields:
            if field not in production_data:
                return jsonify({
                    "success": False,
                    "error": f"Campo obrigatório ausente: {field}"
                }), 400
        
        success = data_processor.add_production(production_data)
        
        if success:
            return jsonify({
                "success": True,
                "message": "Produção adicionada com sucesso"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Erro ao salvar produção"
            }), 500
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@production_bp.route("/productions/<production_id>", methods=["PUT"])
def update_production(production_id):
    """Atualiza uma produção existente"""
    try:
        updated_data = request.json
        success = data_processor.update_production(production_id, updated_data)
        
        if success:
            return jsonify({
                "success": True,
                "message": "Produção atualizada com sucesso"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Produção não encontrada ou erro ao salvar"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@production_bp.route("/productions/costs/<production_id>", methods=["GET"])
def get_production_costs(production_id):
    """Retorna detalhamento de custos de uma produção"""
    try:
        data = data_processor.load_json_data()
        production = next((item for item in data if item.get("ID_PRODUCAO") == production_id), None)
        
        if not production:
            return jsonify({
                "success": False,
                "error": "Produção não encontrada"
            }), 404
        
        # Campos de custo
        cost_fields = [
            "CORTE", "FACÇÃO", "TRAVET", "ZIPER", "BOTÃO", 
            "APRONTAMENTO", "LAVANDERIA", "BOLSA", "LIMPADO", 
            "TAG + ETIQUETA"
        ]
        
        costs = {}
        total_cost = 0
        
        for field in cost_fields:
            value = production.get(field, 0) or 0
            costs[field] = value
            total_cost += value
        
        # Adiciona informações do tecido
        tecido_cost = (production.get("METRAGEM DO TECIDO", 0) or 0) * (production.get("PREÇO DO TECIDO", 0) or 0)
        costs["TECIDO"] = tecido_cost
        total_cost += tecido_cost
        
        return jsonify({
            "success": True,
            "data": {
                "production_id": production_id,
                "costs": costs,
                "total_cost": total_cost,
                "valor_pedido": production.get("VALOR PEDIDO", 0) or 0,
                "quantidade_pecas": production.get("QUANTIDADE DE PEÇAS", 0) or 0,
                "pagamentos": production.get("PAGAMENTOS", "")
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

