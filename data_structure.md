## Estrutura de Dados para o Dashboard de Produção

Para atender aos requisitos de múltiplas produções e entrada de dados, a estrutura de dados será baseada na planilha `PRODUÇÃOJEANSPLUS.xlsx`, com a adição de um identificador para cada produção.

### Tabela Principal de Produção

Cada linha representará uma entrada de produção. As colunas serão as seguintes:

- **ID_PRODUCAO**: Um identificador único para cada lote de produção (ex: P1, P2, P3, etc.). Isso permitirá agrupar e visualizar dados por produção.
- **DATA**: Data da produção.
- **CORTE**: Custo de corte.
- **FACÇÃO**: Custo de facção.
- **TRAVET**: Custo de travet.
- **ZIPER**: Custo de zíper.
- **BOTÃO**: Custo de botão.
- **APRONTAMENTO**: Custo de aprontamento.
- **LAVANDERIA**: Custo de lavanderia.
- **BOLSA**: Custo de bolsa.
- **LIMPADO**: Custo de limpado.
- **TAG + ETIQUETA**: Custo de tag + etiqueta.
- **METRAGEM DO TECIDO**: Metragem do tecido utilizada.
- **PREÇO DO TECIDO**: Preço do tecido.
- **NOME DO TECIDO**: Nome do tecido.
- **VALOR PROD**: Valor total da produção.
- **QUANTIDADE DE PEÇAS**: Quantidade de peças produzidas.
- **VALOR PEDIDO**: Valor do pedido.
- **PAGAMENTOS**: Informações sobre pagamentos (será necessário parsear esta coluna para extrair valores numéricos e datas, se aplicável).

### Armazenamento dos Dados

Inicialmente, os dados serão armazenados em um arquivo CSV ou JSON para facilitar a leitura e escrita pelo backend. No futuro, para maior escalabilidade e robustez, pode-se considerar um banco de dados (SQLite, por exemplo).

### Páginas do Dashboard

O dashboard terá as seguintes seções/páginas:

1.  **Visão Geral da Produção**: Exibirá um resumo dos valores reais de produção, talvez com gráficos de tendências e comparativos.
2.  **Detalhes da Produção (P1, P2, P3...)**: Cada produção terá sua própria seção ou um filtro para selecionar a produção desejada, mostrando todos os custos e pagamentos associados.
3.  **Adicionar Nova Produção**: Um formulário para que o usuário possa inserir os dados de uma nova produção, que será então adicionada à tabela principal e refletida nas visualizações.



## Arquitetura do Dashboard

O dashboard será desenvolvido como uma aplicação web, utilizando as seguintes tecnologias:

-   **Backend**: Flask (Python) para manipulação de dados, API e servir os arquivos estáticos.
-   **Frontend**: HTML, CSS e JavaScript para a interface do usuário e visualização dos dados.
-   **Armazenamento de Dados**: Inicialmente, um arquivo CSV ou JSON para persistência dos dados de produção. Isso permitirá a fácil adição de novas produções.

### Fluxo de Dados

1.  **Carregamento Inicial**: Ao iniciar a aplicação, o backend lerá os dados existentes do arquivo CSV/JSON.
2.  **Visualização**: O frontend fará requisições ao backend para obter os dados necessários para exibir os gráficos e tabelas nas diferentes páginas.
3.  **Adição de Nova Produção**: O usuário preencherá um formulário no frontend. Ao submeter, os dados serão enviados para o backend via API.
4.  **Persistência**: O backend validará os dados e os adicionará ao arquivo CSV/JSON existente.
5.  **Atualização do Dashboard**: Após a adição, o frontend poderá recarregar os dados para refletir a nova produção.

### Componentes Principais

-   **API RESTful**: O backend Flask exporá endpoints para:
    -   Obter todos os dados de produção.
    -   Obter dados de uma produção específica (filtragem).
    -   Adicionar uma nova produção.
-   **Interface do Usuário**: O frontend terá:
    -   Navegação entre as páginas (Visão Geral, Detalhes da Produção, Adicionar Nova Produção).
    -   Gráficos e tabelas para visualização dos dados.
    -   Formulário para entrada de dados.

### Próximos Passos

1.  Criar o ambiente Flask.
2.  Implementar a leitura inicial dos dados da planilha Excel e salvá-los em um formato mais fácil de manipular (CSV/JSON).
3.  Desenvolver os endpoints da API no Flask.
4.  Construir a interface do usuário no frontend.
5.  Integrar frontend e backend.
6.  Implementar a funcionalidade de adicionar nova produção.


