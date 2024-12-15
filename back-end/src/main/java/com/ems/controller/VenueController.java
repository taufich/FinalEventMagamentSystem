package com.ems.controller;

import com.ems.model.Venue;
import com.ems.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {
    @Autowired
    private VenueService venueService;

    @GetMapping
    public List<Venue> getAllVenues() {
        return venueService.findAll();
    }

    @PostMapping
    public Venue createVenue(@RequestBody Venue venue) {
        // Logic to create a venue
        return venueService.save(venue);
    }

    // Additional endpoints for venue management
}
