# Trilha Aberta

Catálogo piloto de cursos, trilhas e materiais gratuitos para quem quer começar a aprender tecnologia.

## O que o MVP faz

- Busca por nome, provedor, tema ou descrição.
- Filtros por área e nível.
- Alternância entre tema claro e escuro, com preferência guardada no navegador e tema do sistema usado na primeira visita.
- Favoritos salvos apenas no navegador da pessoa, usando `localStorage`.
- Links diretos para as fontes oficiais.
- Interface responsiva e navegação acessível por teclado.
- Não tem cadastro, backend, analytics nem coleta de dados pessoais.

## Como abrir

1. Baixe ou extraia os arquivos deste repositório.
2. Abra `index.html` em um navegador moderno.

O MVP usa HTML, CSS e JavaScript sem dependências ou etapa de build para facilitar os primeiros testes e a publicação. A interface pode migrar para React em uma etapa futura, se o escopo crescer.

## Publicar com GitHub Pages

1. Crie um repositório chamado `trilha-aberta` e envie estes arquivos para a branch `main`.
2. No GitHub, abra **Settings > Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch `main` e a pasta `/ (root)`, salve e aguarde a publicação.

## Como atualizar o catálogo

Edite `resources.js` e mantenha os campos `title`, `provider`, `description`, `topic`, `level`, `format`, `access`, `accessNote`, `duration`, `url` e `checkedAt`. Priorize páginas oficiais e atualize a data quando verificar uma fonte. Disponibilidade, vagas, idiomas, exigência de cadastro e gratuidade podem mudar. Confirme as condições no provedor antes de divulgar uma oportunidade.

## Estrutura

```text
trilha-aberta/
|-- index.html
|-- styles.css
|-- app.js
|-- resources.js
|-- README.md
`-- docs/
    `-- proposta-do-projeto.md
```

## Escopo e próximos passos

Este é um MVP de interface estática. O catálogo inicial demonstra a busca, os filtros e os favoritos; a lista ainda precisa ser ampliada e validada com pessoas iniciantes. A proposta completa está em [`docs/proposta-do-projeto.md`](docs/proposta-do-projeto.md).

Próximas melhorias possíveis: permitir que a comunidade sugira links por Issues, adicionar filtros de modalidade, testar o conteúdo com estudantes e publicar uma versão hospedada.
