package com.ems.controller;

import com.ems.model.Event;
import com.ems.model.Registration;
import com.ems.model.User;
import com.ems.service.EventService;
import com.ems.service.RegistrationService;
import com.ems.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    

    @PostMapping
    public Registration createRegistration(@RequestBody Map<String, Object> payload) {
        // Extract username and id (Event ID) from the payload
        String username = (String) payload.get("username");
        Object eventIdObject = payload.get("id"); // Use "id" instead of "eventId"
    
        if (username == null || eventIdObject == null) {
            throw new IllegalArgumentException("Both 'username' and 'id' are required.");
        }
    
        Long eventId;
        try {
            eventId = ((Number) eventIdObject).longValue();
        } catch (ClassCastException e) {
            throw new IllegalArgumentException("'id' must be a valid number.");
        }
    
        // Fetch the event from the database
        Event event = eventService.findById1(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Event ID"));
    
        // Create and save the registration
        Registration registration = new Registration();
        registration.setUsername(username);
        registration.setEvent(event);
    
        return registrationService.save(registration);
    }




    @GetMapping("/by/{username}")
    public ResponseEntity<List<Registration>> getRegistrationsByUsername(@PathVariable String username) {
        List<Registration> registrations = registrationService.findByUsername(username);
        
        if (registrations.isEmpty()) {
            return ResponseEntity.noContent().build(); // No registrations found
        }
        
        return ResponseEntity.ok(registrations);
    }


    @GetMapping("/event/{eventId}/users")
    public ResponseEntity<List<User>> getUsersByEvent(@PathVariable Long eventId) {
        // Retrieve all registrations for the event
        List<Registration> registrations = registrationService.findByEventId(eventId);
    
        if (registrations.isEmpty()) {
            return ResponseEntity.noContent().build(); // No users found
        }
    
        // Use the username from each registration to fetch the corresponding User
        List<User> users = registrations.stream()
                .map(registration -> userService.findByUsername(registration.getUsername())) // Fetch User using the username
                .collect(Collectors.toList());
    
        return ResponseEntity.ok(users); // Return the list of full user details
    }
    
}
