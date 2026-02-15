package com.example.demo.controller;

import com.example.demo.model.Unit;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.UnitService;

@RestController
@RequestMapping("/unit")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService unitService;

    @PostMapping
    public ResponseEntity<?> createUnit(@RequestBody Unit request) {
        return ResponseEntity.ok(unitService.createUnit(request));
    }
}
