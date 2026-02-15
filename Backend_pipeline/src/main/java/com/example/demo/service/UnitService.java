package com.example.demo.service;

import com.example.demo.model.Semester;
import com.example.demo.model.Unit;
import com.example.demo.model.User;
import com.example.demo.repository.SemesterRepository;
import com.example.demo.repository.UnitRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final SemesterRepository semesterRepository;

    public Unit createUnit(Unit request) {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String semesterId = user.getCurrentSemesterId();

        if (semesterId == null) {
            throw new RuntimeException("No active semester selected");
        }

        Semester semester = semesterRepository
                .findByIdAndTeacherId(semesterId, user.getId())
                .orElseThrow(() -> new RuntimeException("Semester not found"));

        Unit unit = Unit.builder()
                .title(request.getTitle())
                .semesterId(semester.getId())
                .teacherId(user.getId())
                .createdAt(LocalDateTime.now())
                .build();

        unit = unitRepository.save(unit);

        semester.getUnitSequence().add(unit.getId());
        semesterRepository.save(semester);

        return unit;
    }
}
