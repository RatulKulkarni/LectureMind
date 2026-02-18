package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Lecture;

public interface LectureRepository extends MongoRepository<Lecture, String> {
    
}
