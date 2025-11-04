

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload


app = FastAPI(title="FormAI Backend")
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # For MVP, allow all origins
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)
app.include_router(upload.router)

if __name__ == "__main__":
	import uvicorn
	uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
