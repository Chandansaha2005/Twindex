from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.gemini_client import run_twindex, run_prescription_analysis
from app.schemas import SimulationRequest, SimulationResponse
import logging
import base64

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Twindex AI Backend",
    description="Gemini AI powered predictive health simulation engine",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/simulate", response_model=SimulationResponse)
async def simulate(request: Request):
    """
    Generate a health risk trajectory simulation based on user input.
    
    Accepts both:
    1. JSON Content-Type with 'prompt' field (for standard simulation)
    2. Multipart form-data with 'prompt' and optional 'image' (for prescription analysis)
    
    Returns:
        SimulationResponse with the AI-generated 'result' field
        
    Raises:
        HTTPException: If there's an error processing the request
    """
    try:
        content_type = request.headers.get('content-type', '')
        prompt = None
        image_base64 = None
        image_mime_type = None
        
        # Parse based on content type
        if 'application/json' in content_type:
            # JSON request - standard simulation
            data = await request.json()
            prompt = data.get('prompt')
            logger.info(f"Processing JSON simulation request: {prompt[:50] if prompt else 'N/A'}...")
            
        elif 'multipart/form-data' in content_type:
            # Form-data request - could have image
            form_data = await request.form()
            prompt = form_data.get('prompt')
            image_file = form_data.get('image')
            
            if image_file:
                # Prescription analysis with image
                logger.info("Processing prescription analysis with image...")
                image_bytes = await image_file.read()
                image_base64 = base64.b64encode(image_bytes).decode('utf-8')
                image_mime_type = image_file.content_type
            else:
                logger.info(f"Processing form-data simulation request: {prompt[:50] if prompt else 'N/A'}...")
        else:
            raise ValueError("Unsupported content type. Use application/json or multipart/form-data")
        
        # Validate prompt
        if not prompt:
            raise ValueError("No prompt provided")
        
        # Process request
        if image_base64:
            # Prescription analysis
            output = run_prescription_analysis(prompt, image_base64, image_mime_type)
            logger.info("Prescription analysis completed successfully")
        else:
            # Standard simulation
            output = run_twindex(prompt)
            logger.info("Simulation completed successfully")
        
        return SimulationResponse(result=output)
            
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing simulation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error processing simulation request")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}