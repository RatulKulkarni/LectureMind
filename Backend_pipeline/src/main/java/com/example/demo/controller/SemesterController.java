package com.example.demo.controller;

import com.example.demo.model.Semester;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.SemesterService;

@RestController
@RequestMapping("/semester")
@RequiredArgsConstructor
public class SemesterController {

    private final SemesterService semesterService;

    @PostMapping
    public ResponseEntity<?> createSemester(@RequestBody Semester request) {
        return ResponseEntity.ok(semesterService.createSemester(request));
    }
}

