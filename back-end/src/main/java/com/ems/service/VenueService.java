package com.ems.service;

import com.ems.model.Venue;
import com.ems.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {
    @Autowired
    private VenueRepository venueRepository;

    public List<Venue> findAll() {
        return venueRepository.findAll();
    }

    public Venue save(Venue venue) {
        return venueRepository.save(venue);
    }

    // Additional methods for venue management
}
