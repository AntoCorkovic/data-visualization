from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv(dotenv_path="./.env")

# Supabase credentials from .env
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# Enable CORS for frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define constants
MAX_FILE_SIZE_MB = 10  # Maximum file size in MB
SUPPORTED_FILE_TYPES = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
BUCKET_NAME = "file-storage"


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), user_id: str = Form(...)):
    try:
        # Validate file type
        if file.content_type not in SUPPORTED_FILE_TYPES:
            raise HTTPException(status_code=400, detail="Only CSV or Excel files are supported")

        # Validate file size
        if file.spool_max_size > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_FILE_SIZE_MB}MB limit")

        # Check if the user already has a file in the bucket
        existing_files = supabase.storage.from_(BUCKET_NAME).list(path=f"{user_id}/")
        if existing_files and len(existing_files) > 0:
            raise HTTPException(status_code=400, detail="A file already exists for this user. Please delete it before uploading a new one.")

        # Read CSV or Excel file into a DataFrame
        if file.filename.endswith(".csv"):
            data = pd.read_csv(file.file)
        elif file.filename.endswith(".xlsx"):
            data = pd.read_excel(file.file, engine='openpyxl')

        # Upload file to Supabase storage
        file_content = await file.read()
        file_path = f"{user_id}/{file.filename}"  # Define file path in bucket
        response = supabase.storage.from_(BUCKET_NAME).upload(file_path, file_content)

        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"]["message"])

        # Get public URL of the uploaded file
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)

        # Return the columns, preview, and file URL
        return {
            "columns": list(data.columns),
            "preview": data.head(10).to_dict(),
            "file_url": public_url,
        }

    except Exception as e:
        return {"error": str(e)}


@app.get("/files/")
def list_files(user_id: str):
    """
    List all files for a specific user.
    """
    try:
        response = supabase.storage.from_(BUCKET_NAME).list(path=f"{user_id}/")
        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"]["message"])
        return {"files": response}
    except Exception as e:
        return {"error": str(e)}


@app.delete("/delete/")
def delete_file(user_id: str, file_name: str):
    """
    Delete a specific file for a user.
    """
    try:
        file_path = f"{user_id}/{file_name}"
        response = supabase.storage.from_(BUCKET_NAME).remove([file_path])
        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"]["message"])
        return {"success": True}
    except Exception as e:
        return {"error": str(e)}


