import pandas as pd

df = pd.read_excel("/home/ubuntu/upload/Relatório-sem-título-ago-1-2025-a-ago-24-2025.xlsx", header=0)

# Renomear colunas para facilitar o acesso
df.rename(columns={
    "Valor usado (BRL)": "Valor usado (BRL)",
    "Leads": "Leads"
}, inplace=True)

# Limpar e converter colunas para numérico
df["Valor usado (BRL)"] = pd.to_numeric(df["Valor usado (BRL)"], errors="coerce").fillna(0)
df["Leads"] = pd.to_numeric(df["Leads"], errors="coerce").fillna(0)

# Agrupar por plataforma e somar os valores, excluindo a linha 'All'
platform_summary = df.groupby("Plataforma")[["Valor usado (BRL)", "Leads"]].sum()
platform_summary = platform_summary.drop("All", errors="ignore")

# Calcular Custo por Lead (CPL)
platform_summary["Custo por Lead (CPL)"] = platform_summary["Valor usado (BRL)"] / platform_summary["Leads"]

print(platform_summary.to_markdown())


