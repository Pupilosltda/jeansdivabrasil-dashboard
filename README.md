# Dashboard de Produção - Versão Completa

## 📋 Descrição

Dashboard completo para gestão de produção de confecção com funcionalidades de visualização, edição e análise de custos. Sistema desenvolvido em Flask com interface moderna e responsiva.

## ✨ Funcionalidades Implementadas

### 🏠 Visão Geral
- **Métricas em tempo real**: Total de produções, valor total e quantidade de peças
- **Gráfico interativo**: Visualização dos valores dos pedidos por produção
- **Design responsivo**: Interface adaptável para desktop e mobile

### 📊 Gestão de Produções
- **Listagem completa**: Visualização de todas as produções cadastradas
- **Detalhes de custos**: Modal com breakdown completo de custos e cálculo de lucro
- **Edição completa**: Formulário para editar todos os campos de uma produção
- **Nova produção**: Formulário para cadastrar novas produções

### 💰 Análise de Custos
- **Custos detalhados**: Corte, Facção, Travet, Zíper, Botão, Aprontamento, Lavanderia, Bolsa, Limpado, Tag + Etiqueta
- **Informações do tecido**: Metragem e preço do tecido
- **Cálculo automático**: Lucro calculado automaticamente (Valor do Pedido - Custos Totais)
- **Formatação brasileira**: Valores em Real (R$) com formatação adequada

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Pip (gerenciador de pacotes Python)

### Instalação
1. Extrair o projeto
2. Instalar dependências:
```bash
pip install -r requirements.txt
```

3. Executar o servidor:
```bash
python main.py
```

4. Acessar no navegador:
```
http://localhost:5000
```

## 📁 Estrutura do Projeto

```
dashboard_project/
├── main.py                 # Arquivo principal do Flask
├── requirements.txt        # Dependências do projeto
├── data/
│   └── productions.json   # Banco de dados em JSON
├── src/
│   ├── models/            # Modelos de dados
│   └── routes/            # Rotas da API
├── static/
│   ├── index.html         # Interface principal
│   └── script.js          # JavaScript do frontend
└── database/              # Diretório do banco SQLite
```

## 🔧 Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **JSON**: Persistência de dados
- **SQLite**: Banco de dados (configurado mas usando JSON)

### Frontend
- **HTML5**: Estrutura da página
- **CSS3/Bootstrap 5**: Estilização e responsividade
- **JavaScript**: Interatividade e comunicação com API
- **Chart.js**: Gráficos interativos
- **Font Awesome**: Ícones

## 📡 API Endpoints

### Produções
- `GET /api/productions` - Lista todas as produções
- `POST /api/productions` - Cria nova produção
- `GET /api/productions/{id}` - Busca produção específica
- `PUT /api/productions/{id}` - Atualiza produção
- `GET /api/productions/summary` - Resumo para dashboard
- `GET /api/productions/costs/{id}` - Detalhes de custos

## 🎨 Interface

### Design
- **Tema**: Gradiente roxo moderno
- **Layout**: Sidebar fixa com navegação por abas
- **Componentes**: Cards, modais, formulários responsivos
- **Tipografia**: Fontes legíveis e hierarquia clara

### Navegação
1. **Visão Geral**: Dashboard principal com métricas e gráfico
2. **Produções**: Lista de produções com ações (Ver Detalhes/Editar)
3. **Nova Produção**: Formulário para cadastro

## 📊 Dados de Exemplo

O sistema vem com 3 produções de exemplo:
- **PROD001**: Jeans Azul Premium - R$ 2.500,00 (50 peças)
- **PROD002**: Sarja Preta - R$ 1.800,00 (30 peças)
- **Produção Teste**: Tecido de Teste - R$ 1.250,00 (25 peças)

## 🔄 Funcionalidades Testadas

✅ Visualização de métricas na visão geral
✅ Gráfico de produções funcionando
✅ Listagem de produções
✅ Adição de nova produção
✅ Edição de produção existente
✅ Visualização de detalhes de custos
✅ Cálculo automático de lucros
✅ Responsividade em diferentes tamanhos de tela
✅ Validação de formulários
✅ Persistência de dados

## 🚀 Melhorias Implementadas

1. **Interface Moderna**: Design completamente renovado com gradientes e componentes modernos
2. **Funcionalidade de Edição**: Possibilidade de editar produções existentes
3. **Análise de Custos**: Breakdown detalhado de todos os custos de produção
4. **Responsividade**: Interface adaptável para diferentes dispositivos
5. **Validação**: Campos obrigatórios e validação de dados
6. **Formatação**: Valores monetários formatados em Real brasileiro

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar se todas as dependências estão instaladas
2. Confirmar que a porta 5000 está disponível
3. Verificar logs no terminal para erros específicos

## 🔮 Próximos Passos Sugeridos

- Implementar autenticação de usuários
- Adicionar relatórios em PDF
- Integrar com banco de dados PostgreSQL
- Implementar backup automático
- Adicionar filtros e busca avançada
- Criar dashboard de análise temporal

