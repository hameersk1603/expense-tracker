package com.hameer.expense_tracker.controller;

import com.hameer.expense_tracker.model.User;
import com.hameer.expense_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            savedUser.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> loggedInUser = userService.loginUser(user.getEmail(), user.getPassword());
        if (loggedInUser.isPresent()) {
            loggedInUser.get().setPassword(null);
            return ResponseEntity.ok(loggedInUser.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            user.get().setPassword(null);
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }
}