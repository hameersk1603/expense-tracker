package com.hameer.expense_tracker.service;

import com.hameer.expense_tracker.model.Income;
import com.hameer.expense_tracker.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    public Income addIncome(Income income) {
        income.setCreatedAt(LocalDateTime.now());
        return incomeRepository.save(income);
    }

    public List<Income> getAllIncomesByUser(Long userId) {
        return incomeRepository.findByUserId(userId);
    }

    public void deleteIncome(Long id) {
        incomeRepository.deleteById(id);
    }
}