from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.api import router as api_router

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok"}