import os
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sbishop import check_convergence, Slice
from utils import convert_to_json, convert_to_slice
import dotenv

dotenv.load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/solve")
async def solve(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    if file.content_type not in ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]:
        raise HTTPException(status_code=400, detail="Invalid file type")

    temp_file_path = f"/{file.filename}"
    content = await file.read()
    with open(temp_file_path, "wb") as f:
        f.write(content)

    try: 
         data = await convert_to_json(temp_file_path) 
         
         slices = convert_to_slice(data)
        
         # Calculate Factor of Safety
         FOS = check_convergence(slices, initial_guess_fos=0.1, tolerance=0.0001, max_iterations=10000)
    
         determination = "Stable" if FOS >= 1 else "Unstable"
    except: 
         raise HTTPException(status_code=500, detail="Error Processing file")
    
    return JSONResponse({"FactorOfSafety": round(FOS, 4), "Inference": determination})

@app.get("/download-template")
async def download_template():
    path = "./../src/template.xlsx"
    if os.path.exists(path):
        return FileResponse(path, filename="template.xlsx", media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    else:
        raise HTTPException(status_code=500, detail="Template file not found")

@app.get("/")
async def root():
    return {"message": "Hello World!"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3200))
    uvicorn.run(app, host="0.0.0.0", port=port)
