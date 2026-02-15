from fastapi import FastAPI, UploadFile, File
import whisper
import tempfile
import os

app = FastAPI(title="Whisper Transcription Service")

# Load model ONCE at startup
model = whisper.load_model("small")

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Save uploaded audio to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        audio_path = tmp.name

    try:
        result = model.transcribe(
            audio_path,
            task="translate",
            verbose=False,
        )

        segments = [
            {
                "start": round(seg["start"], 2),
                "end": round(seg["end"], 2),
                "text": seg["text"].strip()
            }
            for seg in result.get("segments", [])
        ]

        return {
            "detected_language": result.get("language"),
            "full_text": result.get("text", "").strip(),
            "segments": segments
        }

    finally:
        os.remove(audio_path)
