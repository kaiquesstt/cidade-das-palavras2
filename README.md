# Cidade das Palavras — Hub React v1

Versão consolidada do Hub visual aprovado para o jogo educativo de Língua Portuguesa.

## Stack
- React
- TypeScript
- Vite
- GSAP
- Zustand com persistência local

## O que já funciona
- Mapa ilustrado com 8 bairros clicáveis sem cobrir excessivamente a arte;
- Seleção persistente de bairro;
- Professora-guia reage ao bairro selecionado;
- Missão atual e entrada no briefing da missão;
- Navegação funcional: Início, Mapa, Missões, Conquistas, Caderno e Progresso;
- Caderno com finalidade, pista-chave e contraste;
- Relatório de domínio em Reconhecer / Explicar / Aplicar / Produzir;
- Conquistas;
- Configurações de som e redução de movimento;
- Estado persistente no navegador;
- Briefing reutilizável que será conectado às missões completas.

## Próxima integração planejada
1. Missão completa de Charge;
2. Missão completa de Fábula;
3. Laboratório de Figuras de Linguagem;
4. Replicar a arquitetura para os demais conteúdos.

## Executar
```bash
npm install
npm run dev
```

## Gerar versão de produção
```bash
npm run build
```

A pasta `dist/` poderá ser hospedada no GitHub Pages ou em outro serviço de hospedagem estática.


## Novidade desta versão
- Missão completa do **Distrito da Charge** já implementada;
- Fluxo pedagógico: investigação → classificação → justificativa → contraste → aplicação → produção;
- Atualização automática do progresso de Charge até 100%;
- Novo selo: **Cronista da crítica**.


### Ajuste visual v3
- A charge deixou de ser uma representação CSS simplificada e agora usa uma ilustração ampla e legível, aproximando a implementação da direção visual aprovada.

## Distrito da Charge — v4
- A charge agora permanece grande e legível durante toda a missão.
- O painel de interação fica ao lado e muda conforme a etapa.
- Foram removidas as representações simplificadas por CSS da charge.
- Implementadas seis etapas funcionais: Investigar, Classificar, Justificar, Contrastar, Aplicar e Produzir.
- Progresso de Charge inicia em 0% e chega a 100% ao completar a missão.

## Ajuste v5 — correção de sobreposição
- Corrigido overflow do painel da professora.
- A imagem da professora agora fica estritamente limitada à coluna lateral.
- A charge e o painel de perguntas não são mais cobertos pela imagem lateral.
- Melhorada a adaptação para resoluções intermediárias.

## Distrito da Charge — v6 acessível
- Professora-guia renomeada para **Profª Patrícia**.
- Painel de perguntas reposicionado **abaixo da charge**, para leitura mais confortável.
- Etapas da missão reorganizadas em lista vertical, evitando texto apertado.
- Tamanhos de fonte ampliados.
- Botões **A- / A+** adicionados para acessibilidade e baixa visão.

## Distrito da Charge — v7
- Nome corrigido para **Profª Fabricia**.
- Lista “Sua missão” corrigida para formato vertical, sem sobreposição de palavras.
- Controle A-/A+ corrigido e com indicação visível do percentual de tamanho do texto.
- Botão **Padrão** incluído para restaurar o tamanho inicial.
- Limite de ampliação aumentado para 150%.


## V8 — Primeiro ciclo completo
- Cidade → Charge → aprendizagem → recompensa → cidade restaurada.
- Cada domínio novo concede +25 XP sem duplicar recompensa ao repetir.
- Charge chega a 100% e o mapa exibe brilho, estrela e aviso de restauração.
- Profª Fabricia reconhece o distrito restaurado.
- Acessibilidade global: 90% a 150%, alto contraste e redução de animações.
- A Charge fica consolidada como molde das próximas missões.

## V9 — Floresta das Fábulas
- Distrito de **Fábula** totalmente implementado.
- Texto original: **“A Onça e o Vagalume”**.
- Fluxo: Investigar → Classificar → Justificar → Contrastar Fábula × Lenda → Aplicar → Produzir.
- Moral trabalhada de forma **implícita**, evitando decorar uma definição antes da leitura.
- Produção final em formato de planejamento narrativo.
- Fábula começa em 0% e pode chegar a 100%, restaurando o distrito no mapa.
- Nova conquista: **Leitor de entrelinhas**.
- Mantidas as configurações globais de acessibilidade, XP e restauração visual.


## Publicação no GitHub Pages

Esta versão já inclui publicação automática por GitHub Actions.

### Configuração inicial
1. Envie o projeto para um repositório GitHub.
2. Abra **Settings → Pages**.
3. Em **Build and deployment → Source**, selecione **GitHub Actions**.
4. Faça um push para a branch `main`.

O workflow `.github/workflows/deploy-pages.yml` executará:

```text
npm install
npm run check
npm run build
```

e publicará automaticamente a pasta `dist`.

O `vite.config.ts` usa `base: "./"`, portanto o projeto não precisa ter o nome
do repositório gravado no código e funciona bem em páginas de projeto do GitHub Pages.


## V10 — Vila das Lendas

Terceiro distrito completo do jogo.

- Lenda original: **A Pedra que Canta**.
- Local explicitamente fictício: **Vila do Murici**, dentro do universo do jogo.
- Fluxo completo: Investigar → Classificar → Justificar → Contrastar → Aplicar → Produzir.
- Contraste principal: **Lenda × Fábula × Conto fantástico**.
- Produção final: lugar → acontecimento misterioso → explicação cultural → transmissão entre gerações.
- Nova conquista: **Guardião da memória**.
- A Lenda começa em 0% e pode ser restaurada até 100%.
- Migração de estado preserva progresso já conquistado em Charge e Fábula.
- `src/vite-env.d.ts` já incluído para evitar o erro de módulos `.webp` no GitHub Actions.


## V11 — Câmara da Cidade / Estatuto

Quarto distrito completo do jogo.

- Documento original: **Convivência na Cidade das Palavras**.
- A classificação do gênero fica escondida inicialmente para que o estudante investigue a função antes de receber o nome.
- Fluxo: Investigar → Classificar → Justificar → Contrastar → Aplicar → Produzir.
- Contraste principal: **Estatuto × Regulamento × Artigo de opinião**.
- O jogo explicita que artigos e incisos, sozinhos, não bastam para distinguir estatuto de regulamento.
- Produção final inclui um construtor de norma e uma etapa de **edição real em campo de texto**.
- Nova conquista: **Guardião da convivência**.
- Estatuto começa em 0% e pode ser restaurado até 100%.
- Migração V11 preserva o progresso real de Charge, Fábula e Lenda e remove apenas o antigo progresso-placeholder do Estatuto.


## V12 — Redação Central / Artigo de opinião

Quinto distrito completo do jogo.

- Artigo original: **“Mais tempo para ler”**.
- Tema: ampliação do horário da Biblioteca Central.
- A consulta estatística do texto é explicitamente identificada como **dado simulado**, evitando apresentá-la como informação factual.
- Nova mecânica inicial: **Lentes da argumentação** para localizar tema, tese, argumento, evidência, contra-argumento e conclusão.
- Fluxo: Investigar → Classificar → Justificar → Contrastar → Aplicar → Produzir.
- Contraste principal: **Artigo de opinião × Carta do leitor × Notícia**.
- Produção final permite escolher posição favorável ou contrária, selecionar dois argumentos, analisar uma objeção/resposta e escrever uma conclusão própria.
- Nova conquista: **Voz argumentativa**.
- Artigo de opinião começa em 0% e pode chegar a 100%.
- Migração V12 preserva o progresso real dos quatro distritos anteriores e remove apenas o antigo progresso demonstrativo do Artigo.


## V13 — Central do Leitor / Carta do leitor

Sexto distrito completo do jogo.

- Situação comunicativa original e fictícia: uma leitora responde a uma reportagem do **Jornal da Cidade**.
- Nova mecânica inicial: **Rastrear o fio da conversa**, conectando publicação anterior, destinatário, posicionamento, argumento, proposta e identificação.
- Fluxo: Investigar → Classificar → Justificar → Contrastar → Aplicar → Produzir.
- Contraste principal: **Carta do leitor × Artigo de opinião × Carta pessoal**.
- A missão destaca que saudação, assinatura e tamanho não bastam para classificar o gênero.
- Produção final: escolha de uma publicação, posicionamento, duas razões, pedido/proposta e escrita de uma mensagem autoral.
- Nova conquista: **Voz do leitor**.
- Carta do leitor começa em 0% e pode chegar a 100%.
- Migração V13 preserva o progresso real dos cinco distritos anteriores e remove apenas o antigo progresso demonstrativo da Carta.


## V14 — Estação Miniconto

Sétimo distrito completo do jogo.

- Miniconto original: **“De volta”**.
- Nova mecânica inicial: **camadas do texto**, trabalhando recorte, movimento narrativo, lacuna e efeito final.
- Inclui um **teste de inferência** para diferenciar leitura sustentada de invenção sem pistas.
- Fluxo: Investigar → Classificar → Justificar → Contrastar → Aplicar → Produzir.
- Contraste principal: **Miniconto × Frase de efeito × Resumo**.
- A missão reforça que brevidade, sozinha, não define o gênero e que reviravolta não é requisito obrigatório.
- Produção final: **Oficina de corte**, com objeto, lugar, mudança, editor autoral e contador de palavras.
- O limite de 50 palavras é apresentado explicitamente como regra didática da oficina, e não como definição universal do gênero.
- Nova conquista: **Mestre da entrelinha**.
- Miniconto começa em 0% e pode chegar a 100%.
- Migração V14 preserva o progresso real dos seis distritos anteriores e remove apenas o antigo progresso demonstrativo do Miniconto.


## V15 — Laboratório das Lentes / Figuras de linguagem

Oitavo e último distrito curricular principal.

Figuras trabalhadas:
- Anáfora — **Lente Eco**
- Eufemismo — **Lente Véu**
- Metáfora — **Lente Portal**
- Comparação — **Lente Ponte**
- Personificação — **Lente Sopro**

Mecânicas:
- Desbloqueio das cinco lentes pelo **efeito de sentido**, antes da memorização do nome.
- Identificação de cinco casos com feedback explicando por que a resposta é correta.
- Etapa específica de justificativa: o estudante precisa selecionar o critério realmente válido.
- Duelos de contraste: **Metáfora × Comparação**, **Eufemismo × Metáfora**, **Anáfora × repetição qualquer** e **Personificação × ação literal**.
- Aplicação inversa: o jogo apresenta um efeito comunicativo e o estudante escolhe a figura adequada.
- Produção final no **Ateliê das Três Lentes**, com três exemplos autorais de figuras diferentes e autorrevisão.
- Nova conquista: **Mestre das lentes**.
- Conquista extra **Cidade restaurada** quando os sete distritos anteriores já estiverem em 100%.
- Migração V15 preserva o progresso real de todos os distritos anteriores e remove apenas o antigo progresso demonstrativo de Figuras.


## V16 — Polimento para aplicação com estudantes

Esta versão não acrescenta um novo conteúdo. Ela prepara o jogo completo para
a primeira aplicação em sala.

Principais mudanças:

- novos usuários começam em **Nível 1, 0 XP e sem conquistas fictícias**;
- migração remove o antigo estado de demonstração apenas quando não existe
  progresso real;
- nome do estudante pode ser informado em Configurações;
- reinício de sessão exige confirmação e preserva acessibilidade;
- tela cheia disponível diretamente no HUD;
- botão de conquistas do HUD agora é funcional;
- controle **Mostrar/Ocultar nomes** deixa o mapa mais visível;
- textos pequenos e áreas clicáveis foram ampliados;
- foco de teclado também cobre campos de texto;
- a opção **Reduzir animações** passa a interromper também animações CSS;
- briefing dos oito distritos foi reescrito sem mensagens de desenvolvimento;
- missão concluída passa a aparecer como **Revisar missão**;
- tela de Progresso mostra percentual geral, distritos restaurados,
  habilidades concluídas e próxima rota sugerida;
- conquista duplicada “Cidade restaurada” foi removida;
- conquistas genéricas iniciais agora são obtidas pelo progresso real.

## Novo mapa e novos bairros — v17
- Nova arte do mapa (1313×1198), sem textos: os nomes vêm dos pinos.
- O palco do mapa agora tem a mesma proporção da arte, então a imagem aparece inteira
  e os pinos ficam sobre os prédios em qualquer tamanho de tela.
- 10 bairros: os 8 gêneros originais + **A Rede** e **Dados** (missões em construção,
  marcadas com `hasMission: false` em `src/data/districts.ts`).
- Progresso, conquista "Cidade restaurada" e contadores consideram só bairros com missão
  (`playableDistricts`). Progresso salvo da v16 é preservado.
- Observação: todas as 8 missões originais já estão implementadas (a lista
  "O que já funciona" acima é da primeira versão).

## Tipografia e ícones — v17.1
- Escala única de 7 tamanhos em `:root` (`--fs-xs` 12px até `--fs-2xl`), pensada para
  Chromebook 1366×768. Nenhum texto abaixo de 12px. Use sempre os tokens em CSS novo.
- Ícones dos bairros em `src/components/DistrictIcon.tsx` (biblioteca `lucide-react`),
  cada um repetindo o símbolo do prédio no mapa.
- Cartão do pino maior (nome 16px, descrição 14px) e abrindo para a esquerda nos bairros da direita.

## Missão Charge com casos — v17.2
- O conteúdo da missão fica em `src/data/chargeCases.ts`; a tela funciona com qualquer caso.
- Caso 1 "Pesquisando juntos?" (original), Caso 2 "Ninguém mete a colher", Caso 3 "Ele só é cuidadoso".
- Concluir qualquer caso restaura o distrito; cada caso concluído dá o seu selo.
- Casos sobre violência mostram um aviso de apoio (Ligue 180 / 190).

## Opções embaralhadas — v17.3
- `src/utils/shuffle.ts` embaralha as alternativas de todas as missões a cada abertura,
  para que a resposta certa não fique sempre na mesma posição.
- Ao escrever conteúdo novo, a ordem das opções no código não importa mais.

## Ícones Lucide em todo o app — v17.4
- Navegação, topo, configurações, painel da missão, mapa, professora-guia, avisos de XP,
  selos de conquista e lentes das Figuras usam `lucide-react`.
- Selos de bairro reutilizam o ícone do bairro (`DistrictIcon`).

## Faixas das missões — v17.5
- As faixas do topo das missões usam cenas novas no estilo do mapa (`src/assets/*-district.webp`).
- A Lenda ganhou imagem própria (`legend-district.webp`); a Charge ganhou faixa na tela de casos.
- Enfeites antigos sobre as faixas (§, ✦, ✉, 07, lua, prisma, chuva) foram retirados.
