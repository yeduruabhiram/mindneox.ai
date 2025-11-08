# mps_test.py
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

device = torch.device("mps") if torch.backends.mps.is_available() else torch.device("cpu")
print("Using device:", device)

model_name = "gpt2"  # small test model; change if you prefer
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
model.to(device)

prompt = "Hello from MPS! The quick brown fox"
inputs = tokenizer(prompt, return_tensors="pt").to(device)

with torch.no_grad():
    outputs = model.generate(**inputs, max_new_tokens=40)

print(tokenizer.decode(outputs[0], skip_special_tokens=True))