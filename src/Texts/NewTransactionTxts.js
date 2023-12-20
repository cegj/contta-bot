export const NewTransactionTxts = {
    type: {
      main: "↩️ 🧾 Qual é o <b>tipo</b> da transação que você deseja registrar?\n\nInforme Despesa (D) ou Receita (R)",
      retry: "Por favor, informe Despesa (D) ou Receita (R). Lembre-se de marcar a mensagem para resposta."
    },
    transactionDate: {
      main: "↩️ 📅 Qual é a <b>data da transação</b>?\n\nInforme DD/MM/AAAA, Hoje (H) ou Ontem (O)",
      retry: "Por favor, informe uma data válida no formato correto. Lembre-se de marcar a mensagem para resposta."
    },
    paymentDate: {
      main: "↩️ 📅 Qual é a <b>data do pagamento</b>?\n\nInforme DD/MM/AAAA, Hoje (H) ou Ontem (O)",
      retry: "Por favor, informe uma data válida no formato correto. Lembre-se de marcar a mensagem para resposta."
    },
    value: {
      main: "↩️ 💰 Qual o <b>valor</b> da transação?\n\nInforme um número inteiro ou com duas casas decimais",
      retry: "Por favor, responda um valor válido (inteiro ou com duas casas decimais). Lembre-se de marcar a mensagem para resposta."
    },
    description: {
      main: "↩️ 📝 Qual a <b>descrição</b> da transação?",
      retry: "Por favor, informe uma descrição para a transação. Lembre-se de marcar a mensagem para resposta."
    },
    category: {
      main: "↩️ 🏷️ Qual a <b>categoria</b> da transação?\n\nInforme o número correspondente.\n\n",
      retry: "Por favor, informe um número correspondente a uma categoria. Lembre-se de marcar a mensagem para resposta.",
      retrieving: "Aguarde um momento, estou buscando a lista de categorias..."
    },
    account: {
      main: "↩️ 🏦 Qual a <b>conta</b> da transação?\n\nInforme o número correspondente.\n\n",
      retry: "Por favor, informe um número correspondente a uma conta. Lembre-se de marcar a mensagem para resposta.",
      retrieving: "Agora estou buscando a lista de contas, aguarde..."
    },
    installments: {
      main: "↩️ 🔁 É uma <b>transação parcelada</b>?\n\nSe sim, informe o número de parcelas. Se não, informe não (N).\n\n",
      retry: "Por favor, informe o número de parcelas ou não (N) a transação não seja parcelada. Lembre-se de marcar a mensagem para resposta."
    },
    end: {
      main: "Transação registrada com sucesso! 😊",
      error: "Ocorreu um erro! 🥲"
    }
  }