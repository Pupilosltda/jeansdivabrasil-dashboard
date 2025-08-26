from flask import Blueprint, jsonify, request
import os
import json
import uuid
from datetime import datetime

production_bp = Blueprint("production", __name__)

# Caminho do arquivo JSON
JSON_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "productions.json")

def ensure_data_directory():
    """Garante que o diretório de dados existe"""
    data_dir = os.path.dirname(JSON_FILE)
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

def load_json_data():
    """Carrega dados do arquivo JSON"""
    ensure_data_directory()
    if os.path.exists(JSON_FILE):
        try:
            with open(JSON_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []

def save_json_data(data):
    """Salva dados no arquivo JSON"""
    ensure_data_directory()
    try:
        with open(JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

@production_bp.route("/productions", methods=["GET"])
def get_productions():
    """Retorna todas as produções"""
    try:
        data = load_json_data()
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
        data = load_json_data()
        
        total_productions = len(data)
        total_value = sum(item.get("VALOR PEDIDO", 0) or 0 for item in data)
        total_pieces = sum(item.get("QUANTIDADE DE PEÇAS", 0) or 0 for item in data)
        
        # Dados para o gráfico (últimas 10 produções)
        productions_for_chart = []
        for item in data[-10:]:
            productions_for_chart.append({
                "id": item.get("ID_PRODUCAO", "N/A"),
                "valor_pedido": item.get("VALOR PEDIDO", 0) or 0
            })
        
        summary = {
            "total_productions": total_productions,
            "total_value": total_value,
            "total_pieces": total_pieces,
            "productions": productions_for_chart
        }
        
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
        data = load_json_data()
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
            if field not in production_data or not production_data[field]:
                return jsonify({
                    "success": False,
                    "error": f"Campo obrigatório ausente: {field}"
                }), 400
        
        # Gera ID único
        production_data["ID_PRODUCAO"] = str(uuid.uuid4())[:8].upper()
        
        # Carrega dados existentes
        data = load_json_data()
        data.append(production_data)
        
        # Salva dados
        success = save_json_data(data)
        
        if success:
            return jsonify({
                "success": True,
                "message": "Produção adicionada com sucesso",
                "id": production_data["ID_PRODUCAO"]
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
        data = load_json_data()
        
        # Encontra a produção
        production_index = next((i for i, item in enumerate(data) if item.get("ID_PRODUCAO") == production_id), None)
        
        if production_index is not None:
            # Mantém o ID original
            updated_data["ID_PRODUCAO"] = production_id
            data[production_index] = updated_data
            
            success = save_json_data(data)
            
            if success:
                return jsonify({
                    "success": True,
                    "message": "Produção atualizada com sucesso"
                })
            else:
                return jsonify({
                    "success": False,
                    "error": "Erro ao salvar produção"
                }), 500
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

@production_bp.route("/productions/costs/<production_id>", methods=["GET"])
def get_production_costs(production_id):
    """Retorna detalhamento de custos de uma produção"""
    try:
        data = load_json_data()
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
            costs[field] = float(value)
            total_cost += float(value)
        
        # Adiciona informações do tecido
        metragem = production.get("METRAGEM DO TECIDO", 0) or 0
        preco = production.get("PREÇO DO TECIDO", 0) or 0
        tecido_cost = float(metragem) * float(preco)
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

