export const CheckBudgetTxts = {
    month: {
      main: "↩️ 📅 Qual é o <b>mês e o ano</b> do orçamento que você deseja verificar?\n\nInforme no formato MM/AAAA (ou somente MM para o ano corrente) ou Hoje (H) para o mês atual.",
      retry: "Por favor, informe uma data no formato indicado. Lembre-se de marcar a mensagem para resposta."
    },
    ifCategory: {
      main: "↩️ 🏷️ Deseja verificar o orçamento de alguma <b>categoria</b> específica?\n\nResponda Sim (S) ou Não (N)",
      loopMain: "↩️ 🏷️ Deseja verificar o orçamento de outra <b>categoria</b>? Responda Sim (S) ou Não (N)",
      retry: "Por favor, responda Sim (S) ou Não (N). Lembre-se de marcar a mensagem para resposta.",
      retrieving: "Aguarde um momento, estou buscando a lista de categorias..."
    },
    category: {
      main: "↩️ 🏷️ Você quer ver o orçamento de qual <b>categoria</b>?\n\nInforme o número correspondente.\n\n",
      retry: "Por favor, informe um número correspondente a uma categoria. Lembre-se de marcar a mensagem para resposta.",
    },
    generalResult: {
      main: "O saldo geral para o mês solicitado é o seguinte:",
      retrieving: "Estou buscando os valores do orçamento, por favor aguarde..."
    },
    categoryResult: {
      main: `O orçamento para essa categoria no mês solicitado é o seguinte:`,
    },
    end: {
      main: "Ok, se precisa é só chamar! 😊",
      error: "Ocorreu um erro! 🥲"
    }
}