# Guia de Implantação do Dashboard de Produção na Turbo Cloud

Este guia detalha os passos necessários para implantar o seu Dashboard de Produção (aplicação Flask) na plataforma Turbo Cloud. Certifique-se de ter acesso SSH ou FTP ao seu ambiente na Turbo Cloud.

## 1. Preparação do Projeto

Você já possui o arquivo `dashboard_producao.zip` que contém todo o código-fonte do seu dashboard. Faça o download deste arquivo para o seu computador local.

## 2. Upload do Projeto para a Turbo Cloud

1.  **Conecte-se à sua conta Turbo Cloud**: Utilize o método de acesso fornecido pela Turbo Cloud (SSH, FTP ou painel de controle) para acessar o diretório onde você deseja hospedar sua aplicação.
2.  **Faça o upload do arquivo ZIP**: Transfira o arquivo `dashboard_producao.zip` do seu computador local para o diretório escolhido na Turbo Cloud.
3.  **Descompacte o arquivo**: Via SSH, navegue até o diretório onde você fez o upload e descompacte o arquivo:
    ```bash
    unzip dashboard_producao.zip
    ```
    Isso criará um diretório chamado `dashboard_producao` contendo todos os arquivos do projeto.

## 3. Configuração do Ambiente Python

A Turbo Cloud geralmente oferece ambientes Python pré-configurados. Você precisará criar um ambiente virtual para isolar as dependências do seu projeto.

1.  **Navegue até o diretório do projeto**:
    ```bash
    cd dashboard_producao
    ```
2.  **Crie um ambiente virtual** (se ainda não houver um):
    ```bash
    python3 -m venv venv
    ```
3.  **Ative o ambiente virtual**:
    ```bash
    source venv/bin/activate
    ```

## 4. Instalação das Dependências

Com o ambiente virtual ativado, instale todas as bibliotecas Python necessárias listadas no arquivo `requirements.txt`.

1.  **Instale as dependências**:
    ```bash
    pip install -r requirements.txt
    ```
    Este processo pode levar alguns minutos, dependendo da velocidade da sua conexão e do número de dependências.

## 5. Configuração do Banco de Dados (SQLite)

O dashboard utiliza SQLite como banco de dados, que é um banco de dados baseado em arquivo. O arquivo `app.db` será criado automaticamente na primeira execução da aplicação, dentro do diretório `src/database`.

*   **Verifique as permissões**: Certifique-se de que o usuário que executa a aplicação tenha permissões de escrita no diretório `src/database` para que o arquivo `app.db` possa ser criado e atualizado.

## 6. Execução da Aplicação Flask

Para que a aplicação Flask esteja sempre disponível, é recomendável usar um servidor de aplicação WSGI como Gunicorn, que é comumente suportado por provedores de hospedagem.

1.  **Instale o Gunicorn** (se ainda não estiver instalado no seu ambiente virtual):
    ```bash
    pip install gunicorn
    ```
2.  **Execute a aplicação com Gunicorn**: Navegue até o diretório `dashboard_producao` e execute o seguinte comando:
    ```bash
    gunicorn --bind 0.0.0.0:5000 src.main:app
    ```
    *   `--bind 0.0.0.0:5000`: Isso faz com que o Gunicorn escute em todas as interfaces de rede na porta 5000. A Turbo Cloud irá mapear essa porta para um domínio público.
    *   `src.main:app`: Indica ao Gunicorn para carregar a aplicação Flask (`app`) do arquivo `src/main.py`.

    **Nota**: A Turbo Cloud pode ter um método específico para iniciar aplicações Python (por exemplo, via painel de controle ou um arquivo `Procfile`). Consulte a documentação da Turbo Cloud para o método preferencial de iniciar aplicações WSGI.

## 7. Configuração do Servidor Web (Nginx/Apache - Opcional, geralmente gerenciado pela Turbo Cloud)

A maioria dos serviços de hospedagem como a Turbo Cloud já configura um servidor web (como Nginx ou Apache) para rotear as requisições para a sua aplicação Gunicorn. Você geralmente não precisa configurar isso manualmente, mas é bom estar ciente.

## 8. Acessando o Dashboard

Após a aplicação estar em execução, a Turbo Cloud fornecerá um URL público para acessar o seu dashboard. Verifique o painel de controle da Turbo Cloud para encontrar este URL.

## 9. Solução de Problemas Comuns

*   **`ModuleNotFoundError`**: Se você encontrar este erro, certifique-se de que todas as dependências foram instaladas corretamente (passo 4) e que o ambiente virtual está ativado (passo 3).
*   **Erros de Permissão**: Se a aplicação não conseguir criar o arquivo `app.db` ou outros arquivos, verifique as permissões de escrita nos diretórios relevantes.
*   **Aplicação não inicia**: Verifique os logs da sua aplicação na Turbo Cloud. Eles fornecerão informações detalhadas sobre o que está impedindo o início.

Se você tiver qualquer problema específico durante a implantação na Turbo Cloud, forneça os logs de erro e as etapas que você seguiu, e eu farei o meu melhor para ajudar.

