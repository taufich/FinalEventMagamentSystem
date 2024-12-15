package com.ems.controller;

import com.ems.model.Event;
import com.ems.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    // Retrieve all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.findAll();
    }

    // Retrieve a single event by ID
    @GetMapping("/get/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventService.findById(id);
    }

    // Create a new event
    @PostMapping("/addEvent")
    public Event createEvent(@RequestBody Event event) {
        return eventService.save(event);
    }

    // Update an existing event
    @PutMapping("/edit/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        return eventService.update(id, updatedEvent);
    }

    // Delete an event by ID
    @DeleteMapping("/delete/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteById(id);
    }

    @GetMapping("/by/{username}")
    public List<Event> getEventsByUsername(@PathVariable String username) {
        return eventService.findByUsername(username);
    }

    @GetMapping("/total")
    public long getTotalEvents() {
        return eventService.findAll().size();
    }
}
