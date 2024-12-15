package com.ems.repository;

import com.ems.model.Registration;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByUsername(String username);
    List<Registration> findByEventId(Long eventId);
}
