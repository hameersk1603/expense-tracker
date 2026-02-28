package com.hameer.expense_tracker.service;

import com.hameer.expense_tracker.model.Expense;
import com.hameer.expense_tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense addExpense(Expense expense) {
        expense.setCreatedAt(LocalDateTime.now());
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public List<Expense> getExpensesByCategory(Long userId, String category) {
        return expenseRepository.findByUserIdAndCategory(userId, category);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        expense.setTitle(updatedExpense.getTitle());
        expense.setAmount(updatedExpense.getAmount());
        expense.setCategory(updatedExpense.getCategory());
        expense.setDescription(updatedExpense.getDescription());
        expense.setDate(updatedExpense.getDate());
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }
}