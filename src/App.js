import React, { useState } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, text: 'salary', amount: 1150 },
    { id: 2, text: 'bills', amount: -95 },
    { id: 3, text: 'rent', amount: -850 }
  ]);

  const [text, setText] = useState('');
  const [amount, setAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const calculateBalance = () => {
    const income = transactions.filter(item => item.amount > 0)
                               .reduce((acc, item) => acc + item.amount, 0);

    const expense = transactions.filter(item => item.amount < 0)
                                .reduce((acc, item) => acc + Math.abs(item.amount), 0);

    return {
      balance: income - expense,
      income,
      expense
    };
  };

  const { balance, income, expense } = calculateBalance();

  const addTransaction = (e) => {
    e.preventDefault();
    
    const newTransaction = {
      id: isEditing ? editId : transactions.length + 1,
      text,
      amount: +parseFloat(amount).toFixed(2)
    };
    
    if (isEditing) {
      setTransactions(transactions.map(transaction =>
        transaction.id === editId ? newTransaction : transaction
      ));
      setIsEditing(false);
      setEditId(null);
    } else {
      setTransactions([...transactions, newTransaction]);
    }

    setText('');
    setAmount(0);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const editTransaction = (transaction) => {
    setText(transaction.text);
    setAmount(transaction.amount);
    setIsEditing(true);
    setEditId(transaction.id);
  };

  return (
    <div className="container">
      <h2>Your Balance</h2>
      <h1>&#8369;{balance.toFixed(2)}</h1>
      <div className="income-expense">
        <div>
          <h4>Income</h4>
          <p className="money plus">&#8369;{income.toFixed(2)}</p>
        </div>
        <div>
          <h4>Expense</h4>
          <p className="money minus">&#8369;{expense.toFixed(2)}</p>
        </div>
      </div>

      <h3>History</h3>
      {transactions.length > 0 ? (
        <ul className="list">
          {transactions.map(transaction => (
            <li className={transaction.amount < 0 ? 'minus' : 'plus'} key={transaction.id}>
              {transaction.text} <span>{transaction.amount < 0 ? '-' : '+'}&#8369;{Math.abs(transaction.amount).toFixed(2)}</span>
              <div className="button-container">
                <button className="edit-btn" onClick={() => editTransaction(transaction)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteTransaction(transaction.id)}>X</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-transaction">No recorded transaction</div>
      )}

      <h3>{isEditing ? 'Update Transaction' : 'Add New Transaction'}</h3>
      <form onSubmit={addTransaction}>
        <div className="form-control">
          <label htmlFor="text">Expense Category</label>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Enter category..." 
            required 
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">
            Amount <br />
            (negative - expense, positive - income)
          </label>
          <input 
            type="number" 
            step="0.01"  
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Enter amount..." 
            required 
          />
        </div>
        <button className="btn">{isEditing ? 'Update Transaction' : 'Add Transaction'}</button>
      </form>
    </div>
  );
}

export default App;
