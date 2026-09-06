# Contábil 360 — V2 (atualizada)

Baseada na V2 enviada nesta conversa, mantendo a estrutura visual e acrescentando:

- Consulta de CNPJ diretamente no cadastro da empresa.
- Preenchimento automático dos principais dados cadastrais retornados pela API pública BrasilAPI (razão social, fantasia, situação, porte, natureza jurídica, CNAE, endereço, município/UF, CEP e data de abertura).
- Máscara simples de CNPJ.
- Abas do cadastro de empresa funcionando de fato, separando Dados Gerais, Fiscal, Endereço, DP, Certificado, Sócios, Bancário e Documentos.
- Cadastro de funcionários já habilitado, vinculado à empresa, com dados básicos, contrato e categoria eSocial.
- Persistência local no navegador e exportação JSON.
- Painel de pendências.

## Como usar

1. Extraia o ZIP.
2. Abra `index.html` em um navegador moderno.
3. Em **Empresas > Nova empresa**, informe o CNPJ e clique em **Consultar CNPJ**.
4. Confira os dados retornados antes de salvar.

## Importante sobre a consulta de CNPJ

A V2 é uma aplicação front-end estática. A consulta automática foi preparada usando a API pública BrasilAPI. Isso permite o preenchimento dos dados básicos sem criar um servidor próprio, mas não equivale a uma integração autenticada diretamente com os sistemas internos da Receita Federal.

Para uma versão de produção, o próximo passo é criar um backend seguro para integrar fontes oficiais/serviços autorizados, controlar limites, registrar logs e proteger credenciais. O cadastro de funcionário também está preparado para evoluir para eventos eSocial, mas ainda não envia eventos reais ao eSocial nesta V2.

## Dados

Os dados cadastrados ficam no `localStorage` do navegador. Use **Exportar dados** para gerar um backup JSON.
