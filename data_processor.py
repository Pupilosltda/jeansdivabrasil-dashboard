import pandas as pd
import json
import os
from datetime import datetime

class DataProcessor:
    def __init__(self, excel_file_path, json_file_path):
        self.excel_file_path = excel_file_path
        self.json_file_path = json_file_path
    
    def excel_to_json(self):
        """Converte dados do Excel para JSON com ID de produção"""
        try:
            # Lê o arquivo Excel
            df = pd.read_excel(self.excel_file_path)
            
            # Adiciona ID de produção baseado no índice
            df["ID_PRODUCAO"] = df.index.map(lambda x: f"P{x+1}")
            
            # Converte datas para string
            if "DATA" in df.columns:
                df["DATA"] = df["DATA"].dt.strftime("%Y-%m-%d")
            
            # Converte NaN para None
            df = df.where(pd.notnull(df), None)
            
            # Converte para lista de dicionários
            data = df.to_dict("records")
            
            # Salva em JSON
            with open(self.json_file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            return data
        except Exception as e:
            print(f"Erro ao processar dados: {e}")
            return []
    
    def load_json_data(self):
        """Carrega dados do arquivo JSON"""
        try:
            if os.path.exists(self.json_file_path):
                with open(self.json_file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            return []
        except Exception as e:
            print(f"Erro ao carregar dados JSON: {e}")
            return []
    
    def save_json_data(self, data):
        """Salva dados no arquivo JSON"""
        try:
            with open(self.json_file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"Erro ao salvar dados JSON: {e}")
            return False
    
    def add_production(self, production_data):
        """Adiciona uma nova produção aos dados"""
        data = self.load_json_data()
        
        # Gera novo ID de produção
        max_id = 0
        for item in data:
            if item.get("ID_PRODUCAO", "").startswith("P"):
                try:
                    current_id = int(item["ID_PRODUCAO"][1:])
                    max_id = max(max_id, current_id)
                except:
                    pass
        
        production_data["ID_PRODUCAO"] = f"P{max_id + 1}"
        data.append(production_data)
        
        return self.save_json_data(data)
    
    def update_production(self, production_id, updated_data):
        """Atualiza uma produção existente"""
        data = self.load_json_data()
        for i, item in enumerate(data):
            if item.get("ID_PRODUCAO") == production_id:
                data[i] = {**item, **updated_data}
                return self.save_json_data(data)
        return False
    
    def get_production_summary(self):
        """Retorna resumo das produções"""
        data = self.load_json_data()
        
        summary = {
            "total_productions": len(data),
            "total_value": 0,
            "total_pieces": 0,
            "productions": []
        }
        
        for item in data:
            valor_pedido = item.get("VALOR PEDIDO", 0) or 0
            quantidade_pecas = item.get("QUANTIDADE DE PEÇAS", 0) or 0
            
            summary["total_value"] += valor_pedido
            summary["total_pieces"] += quantidade_pecas
            
            summary["productions"].append({
                "id": item.get("ID_PRODUCAO", ""),
                "data": item.get("DATA", ""),
                "valor_pedido": valor_pedido,
                "quantidade_pecas": quantidade_pecas,
                "nome_tecido": item.get("NOME DO TECIDO", "")
            })
        
        return summary

