from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 👇 Allow ALL origins temporarily (quick fix)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # <-- this means frontend can call backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is running successfully 🚀"}
