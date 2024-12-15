package com.ems.service;

import com.ems.model.Registration;
import com.ems.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrationService {
    @Autowired
    private RegistrationRepository registrationRepository;

    public List<Registration> findAll() {
        return registrationRepository.findAll();
    }

    public Registration save(Registration registration) {
        return registrationRepository.save(registration);
    }

    public List<Registration> findByUsername(String username) {
        return registrationRepository.findByUsername(username);
    }

    public List<Registration> findByEventId(Long eventId) {
        return registrationRepository.findByEventId(eventId); // Assuming you have this query in your repository
    }
    

    

    // Additional methods for registration management
}
