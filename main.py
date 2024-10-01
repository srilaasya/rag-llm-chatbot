from fastapi import FastAPI, HTTPException, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from langchain_handler import initialize_langchain, process_user_message, crawl_website

app = FastAPI()

# Serve static files (like CSS) from the 'static' directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Define the request model
class UserInput(BaseModel):
    message: str

# Global variable to store the crawled data
crawled_data = []

@app.get("/", response_class=HTMLResponse)
async def get():
    with open("input.html") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.post("/crawl")
async def crawl(website: str = Form(...)):
    global crawled_data
    crawled_data = crawl_website(website)
    initialize_langchain(crawled_data)
    return RedirectResponse(url="/chat", status_code=303)

@app.get("/chat", response_class=HTMLResponse)
async def get_chat():
    with open("chat.html") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.get("/initial_greeting/")
async def initial_greeting():
    return {"response": "Hi, I'm an AI assistant trained on the website you provided. How can I help you today?"}

@app.post("/chat/")
async def chat(user_input: UserInput):
    try:
        response, _ = process_user_message(user_input.message, [])
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))