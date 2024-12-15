package com.ems.controller;

import com.ems.model.User;
import com.ems.repository.UserRepository;
import com.ems.security.AuthenticationService;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender emailSender;

    // Registering users

    @PostMapping("/register")
    public String register(@RequestBody User user) {

        // Check if username or email already exists
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username is already taken.");
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email is already in use.");
        }

        userRepository.save(user);
        return "User Saved!!";
    }

    @Autowired
    private AuthenticationService authenticationService;

    // Validating username,password

    @PostMapping("/login")
    public ResponseEntity<User> sendTwoFactorCode(@RequestParam String username, @RequestParam String password) {
        try {
            User user = authenticationService.authenticateUser(username, password);
            return ResponseEntity.ok(user); // Return user data
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(null); // Optionally handle error
        }
    }

    // verifying the OTP from the database

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String otp = body.get("otp");

        try {
            authenticationService.verifyOtp(username, password, otp);
            return ResponseEntity.ok("OTP Verified Successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }

    @GetMapping("/allusers")
    public ResponseEntity<List<User>> getAllUsers() {
        // Retrieve all users from the database
        List<User> users = userRepository.findAll();

        // Filter out users with the role "Admin" and map to a list of new User objects
        List<User> result = users.stream()
                .filter(user -> !"admin".equalsIgnoreCase(user.getRole())) // Exclude Admins

                .map(user -> new User(user.getFirstName(), user.getLastName(), user.getEmail(),
                        user.getContactNumber(), user.getRole()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found.");
        }

        // Generate a reset token
        UUID resetToken = UUID.randomUUID();

        // Store the token in the user's record
        user.setToken(resetToken.toString()); // Store token as string
        userRepository.save(user);

        // Generate the password reset URL
        String resetUrl = "http://localhost:3000/reset-password?token=" + resetToken;

        // Send email to the user with the reset URL
        String subject = "Password Reset Request";
        String bodyz = "Click the following link to reset your password: " + resetUrl;

        sendEmail(user.getEmail(), subject, bodyz);

        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    private void sendEmail(String to, String subject, String bodyz) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@example.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(bodyz);

        emailSender.send(message);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token"); // token is passed as a string
        String newPassword = body.get("password");

        System.out.println(token);
        System.out.println(newPassword);

        // Find the user by the reset token
        User user = userRepository.findByToken(token);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid or expired token.");
        }

        // Update the user's password and clear the token
        user.setPassword(newPassword); // Set the hashed password
        user.setToken(null); // Clear the token
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully.");
    }

    @GetMapping("/total")
    public long getTotalUsers() {
        return userRepository.count();
    }

}
