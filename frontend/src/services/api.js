import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' }
});

export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (data) => api.post('/users/login', data);

export const addExpense = (userId, data) => api.post(`/expenses/add/${userId}`, data);
export const getExpenses = (userId) => api.get(`/expenses/user/${userId}`);
export const deleteExpense = (id) => api.delete(`/expenses/delete/${id}`);

export const addIncome = (userId, data) => api.post(`/incomes/add/${userId}`, data);
export const getIncomes = (userId) => api.get(`/incomes/user/${userId}`);
export const deleteIncome = (id) => api.delete(`/incomes/delete/${id}`);

export default api;