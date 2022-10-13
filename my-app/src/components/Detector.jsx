import MagicDropzone from "react-magic-dropzone";

export default function Detector(props) {

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

    if (!props.classification) {
      props.model.detect(c).then(predictions => {

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
    } else {
      props.model.classify(c,1).then(predictions => {

        const font = "18px courier";
        ctx.font = font;
        ctx.textBaseline = "top";
        ctx.fillStyle = "rgba(0,255,255,0.5)"

        predictions.map(res=>{
          ctx.fillText("\n"+res.className + ":" + res.probability.toFixed(2), 5, 5);
        });      
      });
    }
  };

  return (
    <div className="Dropzone-page">
      <button onClick={()=>props.setIsVideo(true)} className="my-4 mx-2 inline-flex text-black border-2 border-green-800 py-2 px-6 focus:outline-none hover:border-green-500 rounded md:text-lg text-sm" >Use {props.isVideo ? "Photo":"Video"}</button>
      {props.model ? (
        <MagicDropzone
          className="Dropzone"
          accept="image/jpeg, image/png, .jpg, .jpeg, .png"
          multiple={false}
          onDrop={props.onDrop}
          style={{ width: props.displayWidth+2*props.padding, height: props.displayHeight+2*props.padding}}
        >
          {props.source ? (
            <img
              alt="upload preview"
              onLoad={onImageChange}
              className="Dropzone-img"
              src={props.source}
              style={{width:props.displayWidth, height:props.displayHeight}}
            />
          ) : (
            "Choose or drop a file."
          )}
          <canvas id="canvas" width={props.displayWidth} height={props.displayHeight} />
        </MagicDropzone >
      ) : (
        <div className="Dropzone"
          style={{ width: props.displayWidth+2*props.padding, height: props.displayHeight+2*props.padding}}>Loading model...</div>
      )}
    </div>
  );
}