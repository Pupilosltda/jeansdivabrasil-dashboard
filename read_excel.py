import pandas as pd

excel_file = '/home/ubuntu/workspace/PRODUÇÃOJEANSPLUS.xlsx'
df = pd.read_excel(excel_file)
print(df.head().to_markdown(index=False))
