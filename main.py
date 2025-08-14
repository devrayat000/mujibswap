from typing import Annotated

from fastapi import FastAPI, UploadFile
from fastapi.requests import Request
from fastapi.responses import FileResponse, HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from face2face import Face2Face
from face2face.core.modules.utils.utils import ImageFile
from PIL import Image
import io

app = FastAPI(
    version="1.0.0",
    title="MujibSwap API",
    description="A simple API for swapping face with Mujib",
)

templates = Jinja2Templates(directory="templates")

f2f = Face2Face()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def index_page(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")


from fastapi import HTTPException, status


@app.post("/api/swap.jpeg")
async def swap_face_with_mujib(file: UploadFile):

    try:
        img_bytes = await file.read()
        img = ImageFile().from_bytes(img_bytes)

        result = f2f.swap_img_to_img(
            img,
            "static/mujib.jpg",
            enhance_face_model=None,
        )
        if result is None:
            raise ValueError("Face swap failed. No result returned.")
        # Convert BGR (likely) to RGB
        if hasattr(result, "ndim") and result.ndim == 3 and result.shape[2] == 3:
            result_rgb = result[:, :, ::-1]
        else:
            result_rgb = result
        pil_img = Image.fromarray(result_rgb)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Face swap failed. Error: {e}",
        )

    buf = io.BytesIO()
    pil_img.save(buf, format="JPEG")
    result_bytes = buf.getvalue()
    return StreamingResponse(io.BytesIO(result_bytes), media_type="image/jpeg")
