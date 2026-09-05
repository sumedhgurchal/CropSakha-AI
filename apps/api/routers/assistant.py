from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from apps.api.services.gemini_service import gemini_service

router = APIRouter(prefix="/assistant", tags=["Assistant"])

class ChatRequest(BaseModel):
    message: str
    context: str = ""

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """
    Chat with the Gemini AI Botanical Assistant.
    """
    try:
        reply = await gemini_service.chat(request.message, request.context)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
