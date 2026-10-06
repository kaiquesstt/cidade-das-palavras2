import chargePesquisando from "../assets/charge-pesquisando-juntos.webp";
import chargeColher from "../assets/charge-ninguem-mete-a-colher.webp";
import chargeCuidadoso from "../assets/charge-ele-so-e-cuidadoso.webp";

/**
 * Cada caso é um "pacote" de conteúdo da missão Charge.
 * Para acrescentar um caso novo: importar a imagem e copiar um objeto deste array.
 * A tela da missão (ChargeMissionScreen) funciona com qualquer caso.
 */

export interface ChoiceOption {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
}

export interface ApplicationOption {
  id: string;
  title: string;
  text: string;
  correct: boolean;
}

export interface ChargeCase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  /** Selo ganho ao concluir este caso. Também marca o caso como concluído. */
  badge: string;
  /** Casos que tratam de violência mostram um aviso de apoio. */
  sensitive: boolean;
  observations: Array<{ q: string; a: string }>;
  tip: string;
  classifications: ChoiceOption[];
  evidence: Array<{ id: string; label: string; correct: boolean }>;
  evidenceSuccess: string;
  evidenceWarning: string;
  contrast: ChoiceOption[];
  applicationPrompt: string;
  applications: ApplicationOption[];
  applicationSuccess: string;
  applicationWarning: string;
  scenarios: string[];
  targets: string[];
  ironicLines: string[];
}

export const chargeCases: ChargeCase[] = [
  {
    id: "pesquisando-juntos",
    number: 1,
    title: "Pesquisando juntos?",
    subtitle: "Celular, redes sociais e vida escolar",
    image: chargePesquisando,
    imageAlt: "Charge sobre trabalho em grupo, celulares e redes sociais",
    badge: "Cronista da crítica",
    sensitive: false,
    observations: [
      {
        q: "O que os personagens estão fazendo?",
        a: "Eles estão no mesmo trabalho, mas cada estudante usa o celular de forma individual, sem construir a pesquisa coletivamente."
      },
      {
        q: "Qual é a reação da professora?",
        a: "A professora demonstra preocupação e estranhamento, porque o grupo deveria estar colaborando, mas cada estudante está isolado."
      },
      {
        q: "Qual é a relação entre texto e imagem?",
        a: "O texto e a imagem se completam. A proposta é “trabalho em grupo”, mas a imagem mostra justamente a ausência dessa colaboração."
      },
      {
        q: "O que a charge critica?",
        a: "Ela critica o uso superficial do celular e das redes sociais em situações que exigem diálogo, pesquisa e participação real."
      },
      {
        q: "Onde está o humor ou a ironia?",
        a: "A ironia aparece no contraste entre a ideia de colaboração e o comportamento individual dos estudantes."
      }
    ],
    tip: "Observe a contradição entre “trabalho em grupo” e o comportamento individual dos estudantes.",
    classifications: [
      {
        id: "charge",
        label: "Charge",
        correct: true,
        feedback: "Correto. A cena usa linguagem verbal e visual para construir humor e crítica sobre um comportamento atual."
      },
      {
        id: "tirinha",
        label: "Tirinha",
        correct: false,
        feedback: "A tirinha costuma desenvolver uma pequena narrativa em sequência de quadros. Aqui a crítica está concentrada em uma única cena."
      },
      {
        id: "cartaz",
        label: "Cartaz",
        correct: false,
        feedback: "O cartaz geralmente divulga, orienta ou persuade de modo direto. Aqui o objetivo principal é comentar criticamente a situação."
      },
      {
        id: "noticia",
        label: "Notícia",
        correct: false,
        feedback: "A notícia prioriza a informação sobre fatos. Nesta cena, o foco é a crítica e a reflexão."
      }
    ],
    evidence: [
      { id: "critica", label: "Critica um comportamento contemporâneo.", correct: true },
      { id: "visual", label: "O sentido depende da relação entre texto e imagem.", correct: true },
      { id: "ironia", label: "A ironia e o humor ajudam a construir a crítica.", correct: true },
      { id: "nome", label: "Há personagens com nomes próprios.", correct: false },
      { id: "sequencia", label: "Há vários quadros formando uma sequência narrativa.", correct: false }
    ],
    evidenceSuccess: "Você mostrou que a crítica, a relação texto–imagem e a ironia sustentam a classificação.",
    evidenceWarning: "Evite características acidentais. Procure evidências ligadas à finalidade e à construção de sentido.",
    contrast: [
      {
        id: "estrutura",
        label: "Aqui a crítica se concentra em uma única cena; não há uma sequência narrativa de quadros.",
        correct: true,
        feedback: "A estrutura e a finalidade ajudam a diferenciar os gêneros com muito mais segurança."
      },
      {
        id: "cor",
        label: "Não é tirinha porque o desenho está colorido.",
        correct: false,
        feedback: "Tirinhas também podem ser coloridas. A cor não define o gênero."
      },
      {
        id: "politica",
        label: "Não é tirinha porque toda charge precisa falar de política.",
        correct: false,
        feedback: "A charge comenta comportamentos sociais de vários tipos, não só política. E o tema sozinho não separa os gêneros."
      }
    ],
    applicationPrompt: "Qual situação abaixo poderia gerar uma charge usando crítica e ironia?",
    applications: [
      {
        id: "grupo",
        title: "Trabalho em grupo sem colaboração",
        text: "Quatro alunos sentam juntos, mas cada um procura apenas uma resposta pronta no próprio celular.",
        correct: true
      },
      {
        id: "receita",
        title: "Receita de bolo",
        text: "Um texto apresenta ingredientes, quantidades e o passo a passo de preparo.",
        correct: false
      },
      {
        id: "aviso",
        title: "Aviso da escola",
        text: "Um cartaz informa a data e o horário de uma reunião de pais.",
        correct: false
      }
    ],
    applicationSuccess: "Essa situação permite comentar criticamente um comportamento atual por meio do humor.",
    applicationWarning: "Procure uma situação social que possa ser criticada, e não apenas um texto informativo ou instrucional.",
    scenarios: ["Trabalho em grupo", "Fila da cantina", "Biblioteca"],
    targets: ["uso excessivo do celular", "querer apenas uma resposta pronta", "fingir participação sem colaborar"],
    ironicLines: [
      "“Que trabalho em equipe impressionante!”",
      "“Pesquisar juntos ficou muito mais fácil: ninguém precisa conversar.”",
      "“Excelente colaboração... cada um no seu próprio mundo.”"
    ]
  },

  {
    id: "ninguem-mete-a-colher",
    number: 2,
    title: "Ninguém mete a colher",
    subtitle: "Omissão diante da violência doméstica",
    image: chargeColher,
    imageAlt:
      "Charge de um prédio à noite: numa janela, as sombras de um casal discutindo; nas outras, vizinhos fecham as cortinas escondendo colheres atrás das costas e repetem o ditado “Em briga de marido e mulher, ninguém mete a colher”. Na portaria, um cartaz do Ligue 180 que ninguém olha.",
    badge: "Quebra-silêncio",
    sensitive: true,
    observations: [
      {
        q: "O que está acontecendo na janela do meio?",
        a: "Pelas sombras atrás da cortina, um homem se inclina sobre uma mulher, e o balão “!!!” indica gritos. A charge sugere a violência sem precisar mostrá-la."
      },
      {
        q: "O que os vizinhos estão fazendo?",
        a: "Todos fecham cortinas e persianas. Eles ouvem o que acontece, mas escolhem não ver."
      },
      {
        q: "Por que cada vizinho esconde uma colher?",
        a: "É a ironia central. A colher do ditado está na mão de todos: cada um poderia agir, mas esconde essa possibilidade. A imagem mostra que não é falta de meio para ajudar, é escolha de não ajudar."
      },
      {
        q: "Qual é o papel do cartaz “Ligue 180”?",
        a: "Ele mostra que existe um caminho concreto para pedir ajuda, bem na entrada do prédio. Ninguém olha para ele, o que reforça a crítica à omissão."
      },
      {
        q: "O que a charge critica?",
        a: "A omissão da sociedade diante da violência doméstica e o ditado popular que trata essa violência como assunto privado do casal."
      }
    ],
    tip: "Repare no objeto que todos escondem e no cartaz que ninguém olha. A crítica está na distância entre o que os vizinhos dizem e o que a imagem mostra.",
    classifications: [
      {
        id: "charge",
        label: "Charge",
        correct: true,
        feedback: "Correto. Em uma única cena, imagem e texto se juntam para criticar, com ironia, um comportamento social: a omissão diante da violência doméstica."
      },
      {
        id: "tirinha",
        label: "Tirinha",
        correct: false,
        feedback: "As janelas podem parecer quadrinhos, mas todas fazem parte do mesmo prédio, no mesmo instante. Não há uma sequência narrativa."
      },
      {
        id: "cartaz",
        label: "Cartaz",
        correct: false,
        feedback: "Existe um cartaz dentro do desenho, mas ele faz parte da cena. O texto como um todo não divulga um serviço: comenta criticamente a atitude dos vizinhos."
      },
      {
        id: "noticia",
        label: "Notícia",
        correct: false,
        feedback: "Não há relato de um fato específico, com data, local e fontes. A cena é simbólica e serve para provocar reflexão."
      }
    ],
    evidence: [
      { id: "critica", label: "Critica um comportamento social: a omissão diante da violência.", correct: true },
      { id: "visual", label: "O sentido depende de juntar o ditado com as colheres escondidas.", correct: true },
      { id: "ironia", label: "A ironia aparece porque a imagem contradiz o que os vizinhos dizem.", correct: true },
      { id: "telefone", label: "Há um número de telefone, então o texto é informativo.", correct: false },
      { id: "janelas", label: "Cada janela é um quadro diferente de uma história.", correct: false }
    ],
    evidenceSuccess: "Você mostrou que a crítica, a união entre ditado e imagem e a ironia sustentam a classificação.",
    evidenceWarning: "Cuidado com detalhes que aparecem na cena, mas não definem o gênero, como o telefone do cartaz ou a divisão em janelas.",
    contrast: [
      {
        id: "estrutura",
        label: "A cena é única: as janelas pertencem ao mesmo prédio e ao mesmo instante, sem começo, meio e fim em sequência.",
        correct: true,
        feedback: "Isso mesmo. Uma cena só, com a crítica construída de uma vez. É a estrutura que separa os gêneros, não o desenho em si."
      },
      {
        id: "seriedade",
        label: "Não é tirinha porque o tema é sério, e tirinhas só servem para piadas.",
        correct: false,
        feedback: "Tirinhas também tratam de temas sérios. O tema não define o gênero."
      },
      {
        id: "cartaz",
        label: "Não é tirinha porque aparece um cartaz com telefone.",
        correct: false,
        feedback: "Um objeto dentro do desenho não muda o gênero. Observe a estrutura: uma cena ou uma sequência?"
      }
    ],
    applicationPrompt: "Qual situação abaixo poderia gerar uma charge que critica a omissão com ironia?",
    applications: [
      {
        id: "grupo-familia",
        title: "Piada no grupo da família",
        text: "Alguém manda uma “piada” que humilha as mulheres. Todos reagem com risadas, inclusive quem discorda, para “não criar clima”.",
        correct: true
      },
      {
        id: "folheto",
        title: "Folheto de atendimento",
        text: "Um folheto informa endereço, telefone e horário de funcionamento de um centro de atendimento.",
        correct: false
      },
      {
        id: "reportagem",
        title: "Dados do mês",
        text: "Uma reportagem apresenta o número de ocorrências registradas no município no último mês.",
        correct: false
      }
    ],
    applicationSuccess: "Essa situação mostra outra forma de omissão: rir junto para evitar conflito. É um comportamento social que pode ser criticado com ironia.",
    applicationWarning: "Folhetos e reportagens informam. Procure uma atitude das pessoas que possa ser criticada.",
    scenarios: ["Grupo da família no celular", "Ponto de ônibus", "Festa de aniversário"],
    targets: ["rir de piada machista para evitar conflito", "fingir que não viu nada", "culpar a vítima"],
    ironicLines: [
      "“Que festa tranquila! Ninguém ouviu nada.”",
      "“Eu não me meto em nada... só compartilhei o áudio.”",
      "“Melhor ficar quieto: vai que é só amor demais.”"
    ]
  },

  {
    id: "ele-so-e-cuidadoso",
    number: 3,
    title: "Ele só é cuidadoso",
    subtitle: "Ciúme, controle e relacionamento",
    image: chargeCuidadoso,
    imageAlt:
      "Charge de um casal jovem num banco da faculdade à noite: o rapaz examina o celular da namorada com uma lupa e pergunta “Quem é esse? Por que você demorou pra responder?”. Uma corrente de notificações em forma de coração liga o celular dele ao tornozelo dela. A namorada parece desconfortável, e uma amiga diz “Que fofo! Ele se preocupa tanto com você!”.",
    badge: "Olhar atento",
    sensitive: true,
    observations: [
      {
        q: "O que o rapaz está fazendo?",
        a: "Ele examina o celular da namorada com uma lupa, como um detetive investigando uma suspeita, e cobra explicações sobre com quem ela fala e quanto tempo demora para responder."
      },
      {
        q: "Como a namorada reage?",
        a: "Ela está encolhida, com o olhar desviado e calada. Não parece à vontade, nem livre para responder."
      },
      {
        q: "O que representa a corrente de corações?",
        a: "As notificações em forma de coração formam uma corrente que vai do celular dele ao tornozelo dela. Algo que parece carinho funciona como prisão. É uma metáfora visual do controle."
      },
      {
        q: "Por que a fala da amiga é irônica?",
        a: "Ela chama de “fofo” e de “preocupação” o que a imagem mostra como vigilância. O leitor enxerga o contrário do que ela diz."
      },
      {
        q: "O que a charge critica?",
        a: "A naturalização do ciúme e do controle como prova de amor. Vigiar, controlar e isolar alguém são formas de violência psicológica reconhecidas pela Lei Maria da Penha."
      }
    ],
    tip: "Compare o que a amiga diz com o que a imagem mostra. A ironia mora nessa diferença.",
    classifications: [
      {
        id: "charge",
        label: "Charge",
        correct: true,
        feedback: "Correto. Uma única cena une imagem e texto para criticar, com ironia, a ideia de que controle é cuidado."
      },
      {
        id: "tirinha",
        label: "Tirinha",
        correct: false,
        feedback: "A tirinha conta uma pequena história em vários quadros. Aqui tudo acontece em um só quadro."
      },
      {
        id: "meme",
        label: "Meme",
        correct: false,
        feedback: "O meme costuma reaproveitar uma imagem conhecida com novas legendas, para circular e ser recriado. Esta cena foi criada para construir uma crítica específica."
      },
      {
        id: "noticia",
        label: "Notícia",
        correct: false,
        feedback: "Não há relato de um fato real com data, local e fontes. A cena é simbólica e provoca reflexão."
      }
    ],
    evidence: [
      { id: "critica", label: "Critica um comportamento que muitas pessoas tratam como normal.", correct: true },
      { id: "visual", label: "O sentido nasce da contradição entre a fala da amiga e o que a imagem mostra.", correct: true },
      { id: "metafora", label: "A corrente de corações é uma metáfora visual que reforça a crítica.", correct: true },
      { id: "jovens", label: "Os personagens são estudantes universitários.", correct: false },
      { id: "noite", label: "A cena acontece à noite.", correct: false }
    ],
    evidenceSuccess: "Você mostrou que a crítica, a contradição entre texto e imagem e a metáfora visual sustentam a classificação.",
    evidenceWarning: "Quem são os personagens e a hora do dia são detalhes da cena. Procure o que constrói a crítica.",
    contrast: [
      {
        id: "estrutura",
        label: "Tudo acontece em um único quadro: a crítica é construída de uma vez, sem sequência de acontecimentos.",
        correct: true,
        feedback: "Isso mesmo. A estrutura de cena única é o critério mais seguro para diferenciar charge e tirinha."
      },
      {
        id: "baloes",
        label: "Não é tirinha porque tem balões de fala.",
        correct: false,
        feedback: "Tirinhas também usam balões de fala. Esse recurso aparece nos dois gêneros."
      },
      {
        id: "famosos",
        label: "Não é tirinha porque os personagens não são famosos.",
        correct: false,
        feedback: "Personagens conhecidos não são exigência de nenhum dos dois gêneros."
      }
    ],
    applicationPrompt: "Qual situação abaixo poderia gerar uma charge que critica o controle disfarçado de cuidado?",
    applications: [
      {
        id: "senha",
        title: "A senha como prova de amor",
        text: "Um rapaz exige a senha das redes sociais da namorada, e os amigos dele comentam: “Isso é que é homem de verdade!”.",
        correct: true
      },
      {
        id: "manual",
        title: "Tutorial do celular",
        text: "Um texto ensina, passo a passo, como ativar o compartilhamento de localização no celular.",
        correct: false
      },
      {
        id: "enquete",
        title: "Enquete da turma",
        text: "Uma enquete pergunta qual aplicativo de mensagens a turma mais usa.",
        correct: false
      }
    ],
    applicationSuccess: "Essa situação mostra o controle sendo elogiado pelos outros. Dá para criticá-la com ironia, do mesmo jeito que a fala da amiga na charge.",
    applicationWarning: "Tutoriais e enquetes informam ou consultam. Procure uma atitude que possa ser criticada.",
    scenarios: ["Saída da faculdade", "Grupo de mensagens", "Mesa de lanchonete"],
    targets: ["controlar com quem a pessoa conversa", "exigir a localização o tempo todo", "chamar ciúme de prova de amor"],
    ironicLines: [
      "“Que romântico! Ele quer saber onde você está... 24 horas por dia.”",
      "“Ciúme é tempero do amor: hoje foram só 47 mensagens.”",
      "“Que sorte a sua: ele escolhe até as suas amizades!”"
    ]
  }
];
