package com.ems.service;

import com.ems.model.Event;
import com.ems.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    // Retrieve all events
    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    // Retrieve a single event by ID
    public Event findById(Long id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
    }

    public Optional<Event> findById1(Long id) {
        return eventRepository.findById(id);
    }

    // Save a new event
    public Event save(Event event) {
        return eventRepository.save(event);
    }

    // Update an existing event
    public Event update(Long id, Event updatedEvent) {
        Event existingEvent = findById(id);
        existingEvent.setName(updatedEvent.getName());
        existingEvent.setDate(updatedEvent.getDate());
        existingEvent.setHour(updatedEvent.getHour());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setMaxAttendees(updatedEvent.getMaxAttendees());
        return eventRepository.save(existingEvent);
    }

    // Delete an event by ID
    public void deleteById(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }

    public List<Event> findByUsername(String username) {
        return eventRepository.findByBy(username);
    }
}
