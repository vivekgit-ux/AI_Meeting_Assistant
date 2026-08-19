from fastapi import FastAPI

app = FastAPI(title="AI Meeting Assistant")


@app.get("/")
def home():
    return {"message": "AI Meeting Assistant API is running!"}