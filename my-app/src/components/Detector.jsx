import React, { useEffect, useState} from "react";
import MagicDropzone from "react-magic-dropzone";
import { yoloV5 } from "../objectDetection";

export default function Detector() {

  const [model, setModel] = useState();
  const [preview, setPreview] = useState("");
  
  const displayWidth = 400;
  const displayHeight = 400;
  const padding = 5;

  async function loadModel() {
    try {
      const model = await yoloV5().load();
      setModel(model);
    } catch (err) {
      console.log(err);
      console.log("Failed to load model!");
    }
  }

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(()=>{
    return ()=>{}
  },[]);

  const onDrop = (accepted, rejected, links) => {
    const preview = (accepted[0].preview || links[0]); 
    setPreview(preview)
  };

  const cropToCanvas = (image, canvas, ctx) => {

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    // canvas.width = image.width;
    // canvas.height = image.height;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const ratio = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const newWidth = Math.round(naturalWidth * ratio);
    const newHeight = Math.round(naturalHeight * ratio);
    ctx.drawImage(
      image,
      0,
      0,
      naturalWidth,
      naturalHeight,
      (canvas.width - newWidth) / 2,
      (canvas.height - newHeight) / 2,
      newWidth,
      newHeight,
    );

  };

  const onImageChange = e => {

    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    cropToCanvas(e.target, c, ctx);

    model.detect(c).then(predictions => {

      const font = "12px courier";
      ctx.font = font;
      ctx.textBaseline = "top";

      predictions.map(res=>{

        const x1 = res.bbox[0];
        const y1 = res.bbox[1];
        const width = res.bbox[2];
        const height = res.bbox[3];
        // Draw the bounding box.
        ctx.strokeStyle = "rgba(0,255,255,0.8)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x1, y1, width, height);
        // Draw the label background.
        ctx.fillStyle = "rgba(0,255,255,0.5)"//"#00FFFF";
        const textWidth = ctx.measureText(res.class + ":" + res.score).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4);
        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#FF0000";
        ctx.fillText(res.class + ":" + res.score, x1, y1);

      });      
    });
    
  };

  return (
    <div className="Dropzone-page">
      {model ? (
        <MagicDropzone
          className="Dropzone"
          accept="image/jpeg, image/png, .jpg, .jpeg, .png"
          multiple={false}
          onDrop={onDrop}
          style={{ width: displayWidth+2*padding, height: displayHeight+2*padding}}
        >
          {preview ? (
            <img
              alt="upload preview"
              onLoad={onImageChange}
              className="Dropzone-img"
              src={preview}
              width={displayWidth+"px"}
              height={displayHeight+"px"}
            />
          ) : (
            "Choose or drop a file."
          )}
          <canvas id="canvas" width={displayWidth} height={displayHeight} />
        </MagicDropzone>
      ) : (
        <div className="Dropzone"
          style={{ width: displayWidth+2*padding, height: displayHeight+2*padding}}>Loading model...</div>
      )}
    </div>
  );
}