import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string,
  value: number,
  type: 'income' | 'outcome'
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce((accumulator: Balance, transaction: Transaction) => {
      switch(transaction.type){
        case "income":
          accumulator.income += transaction.value
          accumulator.total += transaction.value
          break
        case "outcome":
          accumulator.outcome += transaction.value
          accumulator.total -= transaction.value
        default:
          break
      }
      return accumulator
    }, {
      income: 0,
      outcome: 0,
      total: 0
    })
    return balance
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type })

    this.transactions.push(transaction)

    return transaction
  }
}

export default TransactionsRepository;
