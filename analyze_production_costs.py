import pandas as pd
import sqlite3
from datetime import datetime
import os

# Ler o arquivo Excel
df = pd.read_excel("/home/ubuntu/upload/PRODUÇÃOJEANSPLUS.xlsx")
df.columns = df.columns.str.strip()

print("Dados do arquivo:")
print(df.to_string())
print("\nTotal de linhas:", len(df))
print("Colunas:", df.columns.tolist())

# Reanalisar os cálculos de custos
print("\nReanálise dos cálculos de custos:")
for index, row in df.iterrows():
    print(f"\n--- Pedido {index + 1} ---")
    print(f"Data: {row["DATA"]}")
    print(f"Nome do Tecido: {row["NOME DO TECIDO"]}")
    print(f"Quantidade de Peças: {row["QUANTIDADE DE PEÇAS"]}")
    print(f"Valor Pedido: {row["VALOR PEDIDO"]}")
    
    corte = float(row["CORTE"]) if pd.notna(row["CORTE"]) else 0
    faccao = float(row["FACÇÃO"]) if pd.notna(row["FACÇÃO"]) else 0
    travet = float(row["TRAVET"]) if pd.notna(row["TRAVET"]) else 0
    ziper = float(row["ZIPER"]) if pd.notna(row["ZIPER"]) else 0
    botao = float(row["BOTÃO"]) if pd.notna(row["BOTÃO"]) else 0
    aprontamento = float(row["APRONTAMENTO"]) if pd.notna(row["APRONTAMENTO"]) else 0
    lavanderia = float(row["LAVANDERIA"]) if pd.notna(row["LAVANDERIA"]) else 0
    bolsa = float(row["BOLSA"]) if pd.notna(row["BOLSA"]) else 0
    limpado = float(row["LIMPADO"]) if pd.notna(row["LIMPADO"]) else 0
    tag_etiqueta = float(row["TAG + ETIQUETA"]) if pd.notna(row["TAG + ETIQUETA"]) else 0
    metragem_tecido = float(row["METRAGEM DO TECIDO"]) if pd.notna(row["METRAGEM DO TECIDO"]) else 0
    preco_tecido = float(row["PREÇO DO TECIDO"]) if pd.notna(row["PREÇO DO TECIDO"]) else 0

    # Calcular o custo total de produção por peça
    custo_por_peca = corte + faccao + travet + ziper + botao + aprontamento + lavanderia + bolsa + limpado + tag_etiqueta
    
    # Calcular o custo total de produção para o pedido
    total_custo_producao_pedido = custo_por_peca * (row["QUANTIDADE DE PEÇAS"]) if pd.notna(row["QUANTIDADE DE PEÇAS"]) else 0
    
    # Calcular o custo do tecido para o pedido
    custo_tecido_pedido = metragem_tecido * preco_tecido

    print(f"  Corte: {corte}")
    print(f"  Facção: {faccao}")
    print(f"  Travet: {travet}")
    print(f"  Zíper: {ziper}")
    print(f"  Botão: {botao}")
    print(f"  Aprontamento: {aprontamento}")
    print(f"  Lavanderia: {lavanderia}")
    print(f"  Bolsa: {bolsa}")
    print(f"  Limpado: {limpado}")
    print(f"  Tag + Etiqueta: {tag_etiqueta}")
    print(f"  Custo por Peça (soma dos itens acima): {custo_por_peca:.2f}")
    print(f"  Total Custo Produção (por pedido): {total_custo_producao_pedido:.2f}")
    print(f"  Metragem do Tecido: {metragem_tecido}")
    print(f"  Preço do Tecido: {preco_tecido}")
    print(f"  Custo do Tecido (por pedido): {custo_tecido_pedido:.2f}")
    print(f"  VALOR PROD (da planilha): {row["VALOR PROD"]}")

    # Verificar a discrepância
    if pd.notna(row["VALOR PROD"]) and abs(total_custo_producao_pedido - row["VALOR PROD"]) > 0.01:
        print(f"  DISCREPÂNCIA ENCONTRADA: VALOR PROD da planilha ({row["VALOR PROD"]}) difere do calculado ({total_custo_producao_pedido:.2f})")



