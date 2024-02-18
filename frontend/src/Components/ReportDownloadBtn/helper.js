export function formatter(data) {
  if(!data){
    return null;
  }
  const expenses = {};

  data.expenses.map((expenseObj) => {
    const date = expenseObj.createdAt;
    const expensesOnThatDate = data.expenses.filter(
      (expense) => expense.createdAt === date
    );
    const totalOfThatDate = expensesOnThatDate.reduce(
      (current, upcoming) => current + upcoming.amount,
      0
    );

    expenses[date] = {expenses: expensesOnThatDate, total: totalOfThatDate};
    return expenseObj
  });

  const totalExpense = Object.values(expenses).reduce((current, upcoming)=>current+upcoming.total, 0)
  const budget = +data.label.budget;
  const remainingBalance = budget-totalExpense;
  const label = {...data.label, budget, totalExpense, remainingBalance};

  const result = {label, expenses}
  return result;
}

