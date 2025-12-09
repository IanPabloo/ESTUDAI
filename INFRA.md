# RELATÓRIO DE INFRAESTRUTURA CLOUD - ESTUDAÍ

## 1. CONCEPÇÃO ARQUITETURAL
O desenvolvimento da solução **“Estudaí”** foi baseado no modelo de computação em nuvem conhecido como **Serverless**, que permite criar aplicações sem precisar lidar diretamente com a manutenção ou configuração de servidores. Dessa forma, toda a parte de infraestrutura fica sob responsabilidade da plataforma utilizada, o que facilita o desenvolvimento e reduz complexidades.

Para isso, adotou-se o modelo **BaaS (Backend as a Service)**, utilizando o **Google Firebase** dentro da **Google Cloud Platform**. Essa escolha permite que o aplicativo, desenvolvido com **Capacitor**, se conecte diretamente aos serviços oferecidos pelo Firebase, sem depender de um servidor intermediário para realizar operações básicas como salvar, editar ou consultar dados.

## 2. DETALHAMENTO DOS SERVIÇOS PROVISIONADOS
A estrutura em nuvem foi planejada para garantir que os dados estejam sempre acessíveis e que o sistema funcione de forma estável. Os principais serviços utilizados foram os seguintes:

### 2.1. Persistência de Dados (Cloud Firestore)
Para armazenar os dados, foi escolhido o **Cloud Firestore**, um banco de dados flexível que trabalha com documentos e coleções. Ele permite que as informações sejam organizadas de forma simples e adaptável à necessidade do projeto.

* A coleção **`atividades`** guarda informações sobre tarefas acadêmicas, como título, descrição, prazo e prioridade.
* A coleção **`horarios`** registra a rotina semanal do estudante.

Uma das principais vantagens do Firestore é que ele atualiza as informações em tempo real. Assim, qualquer mudança feita no banco de dados é imediatamente exibida no aplicativo do usuário.

### 2.2. Gestão de Identidade e Acesso (Firebase Authentication)
A parte de login e acesso à conta é realizada pelo **Firebase Authentication**. Ele permite que o usuário entre no sistema usando e-mail e senha de forma segura.

Além disso, o próprio Firebase cuida da criação e gerenciamento das sessões de usuário, evitando problemas relacionados ao armazenamento de senhas e aumentando a segurança geral da aplicação.

## 3. INTEROPERABILIDADE E CONFIGURAÇÃO (CLIENT-SIDE)
A comunicação entre o aplicativo e a nuvem é feita por meio do SDK do Firebase. Para isso, algumas informações são configuradas no código da aplicação, como:

* **apiKey:** usada para identificar o projeto ao fazer requisições.
* **projectId:** que identifica o projeto `estuda-ai-app` dentro da Google Cloud.
* **authDomain:** relacionado ao processo de autenticação.
* **storageBucket:** que serve para armazenar arquivos como imagens e documentos.

Esses parâmetros garantem que o aplicativo consiga se conectar corretamente aos serviços utilizados.

## 4. JUSTIFICATIVA TÉCNICA PARA ADOÇÃO DA NUVEM
A escolha pela computação em nuvem traz vantagens importantes para o desenvolvimento e manutenção da aplicação:

### Elasticidade Automática
O Firestore consegue aumentar sua capacidade automaticamente quando há muitos usuários utilizando o sistema ao mesmo tempo, garantindo que ele continue funcionando bem mesmo em momentos de maior demanda.

### Redução do Trabalho com Infraestrutura
Como não é necessário gerenciar servidores, a equipe pode focar diretamente na criação de funcionalidades e melhorias, sem se preocupar com atualizações, segurança do sistema operacional ou configuração de rede.

### Suporte a Uso Offline
O Firebase também permite que o aplicativo funcione parcialmente mesmo sem internet, graças ao armazenamento temporário de dados no dispositivo do usuário. Isso é especialmente útil para quem usa o app em locais com conexão instável.