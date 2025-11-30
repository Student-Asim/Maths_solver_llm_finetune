from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_NAME = "AsimSaru/gemma-3-1b-it-_gsm8k_math-solver"

# Load tokenizer and model once at startup
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype="auto",
    device_map="auto"
)

class Query(BaseModel):
    question: str

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

@app.post("/solve")
def solve_math(query: Query):
    try:
        print("Received question:", query.question)  # Debug

        # Tokenize input and send to model device
        inputs = tokenizer(query.question, return_tensors="pt").to(model.device)

        # Generate output
        outputs = model.generate(**inputs, max_new_tokens=200)

        # Decode output
        answer = tokenizer.decode(outputs[0], skip_special_tokens=True)

        print("Returning answer:", answer)  # Debug
        return {"question": query.question, "answer": answer}

    except Exception as e:
        print("Inference failed:", str(e))
        raise HTTPException(status_code=500, detail=f"Inference error: {e}")
