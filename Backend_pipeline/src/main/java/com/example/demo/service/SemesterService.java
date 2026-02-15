package com.example.demo.service;

import com.example.demo.model.Semester;
import com.example.demo.model.User;
import com.example.demo.repository.SemesterRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SemesterService {

    private final SemesterRepository semesterRepository;
    private final UserRepository userRepository;

    public Semester createSemester(Semester request) {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Semester semester = Semester.builder()
                .name(request.getName())
                .academicYear(request.getAcademicYear())
                .teacherId(user.getId())
                .createdAt(LocalDateTime.now())
                .build();

        semester = semesterRepository.save(semester);

        user.setCurrentSemesterId(semester.getId());
        userRepository.save(user);

        return semester;
    }
}
