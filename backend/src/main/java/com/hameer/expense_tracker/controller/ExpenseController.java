package com.hameer.expense_tracker.controller;

import com.hameer.expense_tracker.model.Expense;
import com.hameer.expense_tracker.model.User;
import com.hameer.expense_tracker.service.ExpenseService;
import com.hameer.expense_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @PostMapping("/add/{userId}")
    public ResponseEntity<?> addExpense(@PathVariable Long userId, @RequestBody Expense expense) {
        try {
            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            expense.setUser(user);
            Expense saved = expenseService.addExpense(expense);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getAllExpenses(@PathVariable Long userId) {
        List<Expense> expenses = expenseService.getAllExpensesByUser(userId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<Expense>> getByCategory(
            @PathVariable Long userId,
            @PathVariable String category) {
        List<Expense> expenses = expenseService.getExpensesByCategory(userId, category);
        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        try {
            Expense updated = expenseService.updateExpense(id, expense);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok("Expense deleted successfully");
    }
}