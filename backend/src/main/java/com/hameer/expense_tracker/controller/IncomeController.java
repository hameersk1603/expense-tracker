package com.hameer.expense_tracker.controller;

import com.hameer.expense_tracker.model.Income;
import com.hameer.expense_tracker.model.User;
import com.hameer.expense_tracker.service.IncomeService;
import com.hameer.expense_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@CrossOrigin(origins = "*")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @Autowired
    private UserService userService;

    @PostMapping("/add/{userId}")
    public ResponseEntity<?> addIncome(@PathVariable Long userId, @RequestBody Income income) {
        try {
            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            income.setUser(user);
            Income saved = incomeService.addIncome(income);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Income>> getAllIncomes(@PathVariable Long userId) {
        List<Income> incomes = incomeService.getAllIncomesByUser(userId);
        return ResponseEntity.ok(incomes);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.ok("Income deleted successfully");
    }
}