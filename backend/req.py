from transformers import AutoModelForCausalLM, AutoTokenizer
model_name = "AsimSaru/gemma-3-1b-it-_gsm8k_math-solver"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
   model_name,
   torch_dtype="auto", # Automatically selects optimal precision
   device_map="auto" # Automatically maps layers to available devices
)
prompt = "What is 2 + 2"
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=50)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))