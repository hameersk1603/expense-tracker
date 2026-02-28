package com.hameer.expense_tracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "incomes")
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String category;

    @Column
    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @Column
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "createdAt"})
    private User user;
}