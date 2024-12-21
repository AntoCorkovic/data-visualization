from fastapi import FastAPI, UploadFile, File
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read CSV or Excel file into a DataFrame
        if file.filename.endswith(".csv"):
            data = pd.read_csv(file.file)
        elif file.filename.endswith(".xlsx"):
            data = pd.read_excel(file.file, engine='openpyxl')
        else:
            return {"error": "Only CSV or Excel files are supported"}

        # Return first rows of the data
        return {"columns": list(data.columns), "preview": data.head(10).to_dict()}
    except Exception as e:
        return {"error": str(e)}
