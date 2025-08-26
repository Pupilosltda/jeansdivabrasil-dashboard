import pandas as pd
import matplotlib.pyplot as plt

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

# Criar o gráfico
fig, ax = plt.subplots(figsize=(10, 6))

metrics = ["Valor usado (BRL)", "Leads", "Custo por Lead (CPL)"]
platforms = platform_summary.index

x = range(len(platforms))
width = 0.2

for i, metric in enumerate(metrics):
    offset = width * (i - (len(metrics) - 1) / 2)
    ax.bar([p + offset for p in x], platform_summary[metric], width, label=metric)

ax.set_ylabel("Valores")
ax.set_title("Comparativo de Performance por Plataforma (Agosto)")
ax.set_xticks([p + width/2 for p in x])
ax.set_xticklabels(platforms)
ax.legend()

plt.tight_layout()
plt.savefig("/home/ubuntu/performance_chart_agosto.png")


