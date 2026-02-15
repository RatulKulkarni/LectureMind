package com.example.demo.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.TimeUnit;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.*;
import org.springframework.web.client.RestTemplate;

import com.example.demo.model.Lecture;
import com.example.demo.repository.LectureRepository;

@Service
public class VideoProcessingService {

    private static final String BASE_DIR = System.getProperty("user.dir");
    private static final File OUTPUT_DIR = new File(BASE_DIR, "outputs");

    private static final String PYTHON_API_URL = "http://localhost:8000/transcribe";

    private final LectureRepository lectureRepository;

    public VideoProcessingService(LectureRepository lectureRepository) {
        this.lectureRepository = lectureRepository;
    }

    // =========================
    // PIPELINE ORCHESTRATOR
    // =========================
    @Async
    public void processVideoAsync(String lectureId, File videoFile) {

        try {
            OUTPUT_DIR.mkdirs();

            File thumbnailFile = generateThumbnail(lectureId, videoFile);
            File audioFile = extractAudio(lectureId, videoFile);

            if (audioFile == null) {
                System.out.println("Audio extraction failed for lecture: " + lectureId);
                return;
            }

            String pythonResponse = callPythonService(audioFile);
            File transcriptFile = saveTranscriptJson(lectureId, pythonResponse);

            updateLecture(lectureId, thumbnailFile, transcriptFile);

            System.out.println("Lecture processing completed");

        } catch (Exception e) {
            System.out.println("Processing failed for lecture " + lectureId + ": " + e.getMessage());
        }
    }

    // =========================
    // STAGE 1: THUMBNAIL
    // =========================
    private File generateThumbnail(String lectureId, File videoFile) throws Exception {

        File thumbnailFile = new File(OUTPUT_DIR, lectureId + "_thumb.jpg");

        ProcessBuilder builder = new ProcessBuilder(
                "ffmpeg",
                "-y",
                "-i", videoFile.getAbsolutePath(),
                "-ss", "00:00:02",
                "-vframes", "1",
                thumbnailFile.getAbsolutePath()
        );

        executeProcess(builder);

        System.out.println("Thumbnail generated: " + thumbnailFile.getAbsolutePath());
        return thumbnailFile;
    }

    // =========================
    // STAGE 2: AUDIO EXTRACTION
    // =========================
    private File extractAudio(String lectureId, File videoFile) throws Exception {

        File audioFile = new File(OUTPUT_DIR, lectureId + ".wav");

        ProcessBuilder builder = new ProcessBuilder(
                "ffmpeg",
                "-y",
                "-i", videoFile.getAbsolutePath(),
                "-vn",
                "-ac", "1",
                "-ar", "16000",
                audioFile.getAbsolutePath()
        );

        executeProcess(builder);

        if (!audioFile.exists()) {
            return null;
        }

        System.out.println("Audio extracted: " + audioFile.getAbsolutePath());
        return audioFile;
    }

    // =========================
    // STAGE 3: PYTHON CALL
    // =========================
    private String callPythonService(File audioFile) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(audioFile));

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        String response = restTemplate.postForObject(
                PYTHON_API_URL,
                request,
                String.class
        );

        System.out.println("Python Response received");
        return response;
    }

    // =========================
    // STAGE 4: SAVE TRANSCRIPT
    // =========================
    private File saveTranscriptJson(String lectureId, String pythonResponse) throws IOException {

        File transcriptFile = new File(OUTPUT_DIR, lectureId + "_transcript.json");

        try (FileWriter writer = new FileWriter(transcriptFile)) {
            writer.write(pythonResponse);
        }

        System.out.println("Transcript saved: " + transcriptFile.getAbsolutePath());
        return transcriptFile;
    }

    // =========================
    // STAGE 5: UPDATE DB
    // =========================
    private void updateLecture(String lectureId, File thumbnailFile, File transcriptFile) {

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        lecture.setThumbnailPath(thumbnailFile.getAbsolutePath());
        lecture.setTranscriptPath(transcriptFile.getAbsolutePath());
        lecture.setStatus("DONE");

        lectureRepository.save(lecture);

        System.out.println("Lecture updated successfully");
    }

    // =========================
    // COMMON PROCESS EXECUTOR
    // =========================
    private void executeProcess(ProcessBuilder builder) throws Exception {

        builder.redirectErrorStream(true);
        Process process = builder.start();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            while (reader.readLine() != null) {}
        }

        process.waitFor(60, TimeUnit.SECONDS);
    }
}
