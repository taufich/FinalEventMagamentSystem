package com.ems.security;

import com.ems.model.User;
import com.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Authenticates the user and sends a Two-Factor Authentication (2FA) code.
     */
    public User authenticateUser(String username, String password) {
        // Check if the username and password match an existing user
        User user = userRepository.findByUsernameAndPassword(username, password);
        if (user == null) {
            throw new RuntimeException("Invalid username or password.");
        }
    
        // Generate a random 6-digit code as a string
        String twoFactorCode = generateRandomSixDigitCode();
    
        // Save the 2FA code to the user's record
        user.setTwoFactorCode(twoFactorCode);
        userRepository.save(user);
    
        // Send the 2FA code to the user's email
        sendTwoFactorCodeEmail(user.getEmail(), twoFactorCode);
    
        return user; // Return the user object after successful authentication
    }

    /**
     * Verifies the OTP entered by the user.
     */
    public void verifyOtp(String username, String password, String otp) {
        User user = userRepository.findByUsernameAndPassword(username, password);
        if (user == null) {
            throw new RuntimeException("Invalid username or password.");
        }

        if (!otp.equals(user.getTwoFactorCode())) {
            throw new RuntimeException("Invalid OTP.");
        }

        // Clear the OTP after successful verification (optional for security)
        user.setTwoFactorCode(null);
        userRepository.save(user);
    }

    /**
     * Generates a random 6-digit code.
     */
    private String generateRandomSixDigitCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // Ensures a 6-digit number
        return String.valueOf(code);
    }

    /**
     * Sends the 2FA code to the user's email.
     */
    private void sendTwoFactorCodeEmail(String email, String twoFactorCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Two-Factor Authentication Code");
        message.setText("Your 2FA code is: " + twoFactorCode);
        message.setFrom("no-reply@gmail.com");
        mailSender.send(message);
    }
}
