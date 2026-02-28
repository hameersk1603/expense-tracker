import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getExpenses, addExpense, deleteExpense, getIncomes, addIncome, deleteIncome } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import '../styles/Dashboard.css';

const COLORS = ['#4ade80', '#60a5fa', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'];

const CATEGORY_ICONS = {
    Food: '🍔', Transport: '🚗', Shopping: '🛍', Bills: '💡',
    Entertainment: '🎬', Other: '📦', Salary: '💼', Freelance: '💻',
    Business: '🏢', Investment: '📈'
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [activePage, setActivePage] = useState('dashboard');
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');

    const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: '', description: '', date: '' });
    const [incomeForm, setIncomeForm] = useState({ title: '', amount: '', category: '', description: '', date: '' });

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [expRes, incRes] = await Promise.all([
                getExpenses(user.id),
                getIncomes(user.id)
            ]);
            setExpenses(expRes.data);
            setIncomes(incRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addExpense(user.id, expenseForm);
            setExpenseForm({ title: '', amount: '', category: '', description: '', date: '' });
            setShowExpenseModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIncome = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addIncome(user.id, incomeForm);
            setIncomeForm({ title: '', amount: '', category: '', description: '', date: '' });
            setShowIncomeModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalIncome - totalExpense;

    const categoryData = expenses.reduce((acc, expense) => {
        const existing = acc.find(item => item.name === expense.category);
        if (existing) existing.value += expense.amount;
        else acc.push({ name: expense.category, value: expense.amount });
        return acc;
    }, []);

    const allTransactions = [
        ...expenses.map(e => ({ ...e, type: 'expense' })),
        ...incomes.map(i => ({ ...i, type: 'income' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const filteredTransactions = allTransactions.filter(t =>
        t.title.toLowerCase().includes(filter.toLowerCase()) ||
        t.category.toLowerCase().includes(filter.toLowerCase())
    );

    const monthlyData = allTransactions.reduce((acc, t) => {
        const month = t.date?.substring(0, 7);
        let existing = acc.find(item => item.month === month);
        if (!existing) { existing = { month, income: 0, expense: 0 }; acc.push(existing); }
        if (t.type === 'income') existing.income += t.amount;
        else existing.expense += t.amount;
        return acc;
    }, []).sort((a, b) => a.month?.localeCompare(b.month));

    return (
        <div className="app-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-logo">
                    <span className="sidebar-logo-icon">🐸</span>
                    <span className="sidebar-logo-text">spendwise</span>
                </div>
                <nav className="sidebar-nav">
                    {[
                        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
                        { id: 'history', icon: '📋', label: 'History' },
                        { id: 'budget', icon: '💰', label: 'Budget' }
                    ].map(item => (
                        <div key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                            onClick={() => setActivePage(item.id)}>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>
                <div className="sidebar-bottom">
                    <div className="user-info">
                        <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                        <span className="user-name">{user?.name}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h2 className="page-title">
                            {activePage === 'dashboard' && 'Dashboard'}
                            {activePage === 'history' && 'Transaction History'}
                            {activePage === 'budget' && 'Budget Overview'}
                        </h2>
                        <p className="page-welcome">
                            Welcome Back, <span>{user?.name} 👋</span>
                        </p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-income" onClick={() => setShowIncomeModal(true)}>
                            + New Income 🤑
                        </button>
                        <button className="btn-expense" onClick={() => setShowExpenseModal(true)}>
                            + New Expense 🤑
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="summary-card-left">
                            <p>Remaining</p>
                            <h2 className="remaining">₹{remaining.toFixed(2)}</h2>
                            <small>All time</small>
                        </div>
                        <div className="summary-card-icon">🐷</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-card-left">
                            <p>Income</p>
                            <h2 className="income-color">₹{totalIncome.toFixed(2)}</h2>
                            <small>All time</small>
                        </div>
                        <div className="summary-card-icon">↑</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-card-left">
                            <p>Expenses</p>
                            <h2 className="expense-color">₹{totalExpense.toFixed(2)}</h2>
                            <small>All time</small>
                        </div>
                        <div className="summary-card-icon">↓</div>
                    </div>
                </div>

                {/* Dashboard Page */}
                {activePage === 'dashboard' && (
                    <>
                        <div className="charts-row">
                            <div className="chart-card">
                                <h3>Expense Distribution</h3>
                                {categoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}>
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v) => `₹${v}`} contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: '8px', color: '#fff' }} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : <p className="empty-state">No expense data yet</p>}
                            </div>
                            <div className="chart-card">
                                <h3>Monthly Overview</h3>
                                {monthlyData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <AreaChart data={monthlyData}>
                                            <XAxis dataKey="month" stroke="#555" fontSize={11} />
                                            <YAxis stroke="#555" fontSize={11} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: '8px', color: '#fff' }} />
                                            <Area type="monotone" dataKey="income" stroke="#4ade80" fill="#4ade8020" strokeWidth={2} />
                                            <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef444420" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : <p className="empty-state">No data yet</p>}
                            </div>
                        </div>

                        <div className="table-card">
                            <h3>Recent Transactions</h3>
                            {allTransactions.length === 0 ? (
                                <p className="empty-state">No transactions yet. Add income or expense to get started.</p>
                            ) : (
                                allTransactions.slice(0, 6).map((t, i) => (
                                    <div key={i} className="recent-item">
                                        <div className="recent-icon">{CATEGORY_ICONS[t.category] || '📦'}</div>
                                        <div className="recent-info">
                                            <p className="recent-title">{t.title}</p>
                                            <p className="recent-meta">{t.category} • {t.date}</p>
                                        </div>
                                        <span className={t.type === 'income' ? 'recent-amount-income' : 'recent-amount-expense'}>
                                            {t.type === 'income' ? '+' : '-'}₹{t.amount}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* History Page */}
                {activePage === 'history' && (
                    <div className="table-card">
                        <h3>All Transactions</h3>
                        <input className="filter-input" placeholder="Filter by title or category..."
                            value={filter} onChange={(e) => setFilter(e.target.value)} />
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length === 0 ? (
                                    <tr><td colSpan="6" className="empty-state">No transactions found</td></tr>
                                ) : (
                                    filteredTransactions.map((t, i) => (
                                        <tr key={i}>
                                            <td>{t.title}</td>
                                            <td style={{ fontWeight: 'bold', color: t.type === 'income' ? '#4ade80' : '#ef4444' }}>
                                                {t.type === 'income' ? '+' : '-'}₹{t.amount}
                                            </td>
                                            <td><span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>{t.type}</span></td>
                                            <td><span className="category-badge">{t.category}</span></td>
                                            <td>{t.date}</td>
                                            <td>
                                                <button className="btn-delete" onClick={() => {
                                                    if (window.confirm('Delete?')) {
                                                        t.type === 'expense' ? deleteExpense(t.id).then(fetchData) : deleteIncome(t.id).then(fetchData);
                                                    }
                                                }}>🗑 Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Budget Page */}
                {activePage === 'budget' && (
                    <>
                        <div className="budget-grid">
                            {categoryData.length === 0 ? (
                                <p className="empty-state">No categories yet. Add expenses to see budget breakdown.</p>
                            ) : (
                                categoryData.map((cat, index) => (
                                    <div key={cat.name} className="budget-card">
                                        <p>{cat.name}</p>
                                        <h3 style={{ color: COLORS[index % COLORS.length] }}>₹{cat.value.toFixed(2)}</h3>
                                        <small>{((cat.value / totalExpense) * 100).toFixed(1)}% of total expenses</small>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Expense Modal */}
            {showExpenseModal && (
                <div className="modal-overlay" onClick={() => setShowExpenseModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>➕ New Expense</h3>
                        <form onSubmit={handleAddExpense}>
                            <div className="modal-grid">
                                <input className="modal-input" placeholder="Title" value={expenseForm.title}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })} required />
                                <input className="modal-input" type="number" placeholder="Amount (₹)" value={expenseForm.amount}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} required />
                                <select className="modal-input" value={expenseForm.category}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} required>
                                    <option value="">Select Category</option>
                                    <option value="Food">🍔 Food</option>
                                    <option value="Transport">🚗 Transport</option>
                                    <option value="Shopping">🛍 Shopping</option>
                                    <option value="Bills">💡 Bills</option>
                                    <option value="Entertainment">🎬 Entertainment</option>
                                    <option value="Other">📦 Other</option>
                                </select>
                                <input className="modal-input" type="date" value={expenseForm.date}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} required />
                                <input className="modal-input full-width" placeholder="Description (optional)"
                                    value={expenseForm.description}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button className="btn-cancel" type="button" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                                <button className="btn-save" type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Income Modal */}
            {showIncomeModal && (
                <div className="modal-overlay" onClick={() => setShowIncomeModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>💰 New Income</h3>
                        <form onSubmit={handleAddIncome}>
                            <div className="modal-grid">
                                <input className="modal-input" placeholder="Title" value={incomeForm.title}
                                    onChange={(e) => setIncomeForm({ ...incomeForm, title: e.target.value })} required />
                                <input className="modal-input" type="number" placeholder="Amount (₹)" value={incomeForm.amount}
                                    onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })} required />
                                <select className="modal-input" value={incomeForm.category}
                                    onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })} required>
                                    <option value="">Select Category</option>
                                    <option value="Salary">💼 Salary</option>
                                    <option value="Freelance">💻 Freelance</option>
                                    <option value="Business">🏢 Business</option>
                                    <option value="Investment">📈 Investment</option>
                                    <option value="Other">📦 Other</option>
                                </select>
                                <input className="modal-input" type="date" value={incomeForm.date}
                                    onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })} required />
                                <input className="modal-input full-width" placeholder="Description (optional)"
                                    value={incomeForm.description}
                                    onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button className="btn-cancel" type="button" onClick={() => setShowIncomeModal(false)}>Cancel</button>
                                <button className="btn-save" type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Income'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;