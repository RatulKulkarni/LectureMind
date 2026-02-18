package com.example.demo.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "units")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Unit {

    @Id
    private String id;

    private String semesterId;   

    private String title;        

    private LocalDateTime createdAt;

    @Builder.Default
    private List<String> lectureSequence = new ArrayList<>();

    private String teacherId; 
}
