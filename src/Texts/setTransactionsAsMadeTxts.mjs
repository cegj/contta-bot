export const setTransactionsAsMadeTxts = {
    month: {
      main: "↩️ 📅 Qual é o <b>mês e o ano</b> da transação que você deseja consolidar?\n\nInforme no formato MM/AAAA (ou somente MM para o ano corrente) ou Hoje (H) para o mês atual.",
      retry: "Por favor, informe uma data no formato indicado. Lembre-se de marcar a mensagem para resposta."
    },
    typeOfDate: {
      main: "↩️ 📅 Qual é o <b>tipo de data</b> que deve ser considerada para buscar as transações?\n\nInforme Data da transação (T) ou Data do pagamento (P)",
      retry: "Por favor, responda Transação (T) ou Pagamento (P) para selecionar um tipo de data. Lembre-se de marcar a mensagem para resposta."
    },
    category: {
      main: "↩️ 🏷️ Qual a <b>categoria</b> da transação?\n\nInforme o número correspondente.\n\n",
      retry: "Por favor, informe um número correspondente a uma categoria. Lembre-se de marcar a mensagem para resposta.",
      retrieving: "Aguarde um momento, estou buscando a lista de categorias..."
    },
    transactions: {
      main: "↩️ 🏷️ Qual <b>transação</b> você quer consolidar?\n\nInforme o número correspondente.\n\n",
      retrieving: "Estou buscando as transações não consolidadas, por favor aguarde...",
      retry: "Por favor, informe um número correspondente a uma transação. Lembre-se de marcar a mensagem para resposta.",
      empty: "Não há transações não consolidadas nesta categoria. Deseja selecionar outra?\n\nResponda Sim (S) ou Não (N)",
      retryEmpty: "Por favor, informe sim (S) ou não (N). Não se esqueça de marcar a mensagem para resposta.",
      invalid: "Transação inválida. Tente novamente."
    },
    end: {
      main: "Ok, se precisa é só chamar! 😊",
      success: "Transação consolidada com sucesso! 😊",
      error: "Ocorreu um erro! 🥲"
    }
}