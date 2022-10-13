import MagicDropzone from "react-magic-dropzone";
import * as tf from "@tensorflow/tfjs";
import { useState, useEffect } from "react";
import { styleTransfer } from "../styleTransfer/generator"
import { useSelector } from "react-redux";

tf.ENV.set('WEBGL_PACK', false);

export default function Transfer() {
    
    const [style, setStyle] = useState("fuchun");
    const [image, setImage] = useState();
    const [canvas, setCanvas] = useState();
    const [displayWidth, setDisplayWidth] = useState(400);
    const [displayHeight, setDisplayHeight] = useState(400);
    const [source, setSource] = useState("");

    const styles = useSelector(state=>state.styles);
    const padding = 5;

    const onDrop = (accepted, rejected, links) => {
        const source = (accepted[0].preview || links[0]);
        setSource(source)
      };

    useEffect(()=>{
        return ()=>{}
    },[]);

    const cropToCanvas = (image, canvas, ctx) => {

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
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

    const inputImg = document.getElementById('inputImg');
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");

    setImage(inputImg);
    setCanvas(c);

    const w = inputImg.width;
    const h = inputImg.height;
    c.width  = w;
    c.height = h;

    setDisplayWidth(w);
    setDisplayHeight(h);

    cropToCanvas(e.target, c, ctx);
    transfer(inputImg, style, c);
  };

  const transfer = (img, style, canvas) => {

    const context = canvas.getContext("2d");

    styleTransfer('/web_models/'+style).then(style2 => style2.transfer(img)).then(result => {
      
      const resultImg = new Image();

      resultImg.src = result.src;
      cropToCanvas(resultImg, canvas, context);
      //context.drawImage(resultImg,0,0);

      canvas.toBlob(function(blob) {
        var newImg = document.createElement('img');
        var url = URL.createObjectURL(blob);
        
        newImg.src = url;
        //document.getElementById("output").appendChild(newImg);
      }, 'image/jpeg');
    });
  }

  const alterStyle = () => {
    transfer(image, style, canvas)
  }


  return (
    <div className="Dropzone-page">
      {image ? (<button onClick={()=>alterStyle()} className="my-4 mx-2 inline-flex text-black border-2 border-green-800 py-2 px-6 focus:outline-none hover:border-green-500 rounded md:text-lg text-sm" >Set Style</button>):(<></>)}
      {style ? (
        <MagicDropzone
          className="Dropzone"
          accept="image/jpeg, image/png, .jpg, .jpeg, .png"
          multiple={false}
          onDrop={onDrop}
          style={{ width: displayWidth+2*padding, height: displayHeight+2*padding}}
        >
          {source ? (
            <img
              id="inputImg"
              alt="upload preview"
              onLoad={onImageChange}
              className="Dropzone-img"
              src={source}
              width={400}
              style={{opacity:0}}      
              />
          ) : (
            "Choose or drop a file."
          )}
          <canvas id="canvas" />
        </MagicDropzone >
      ) : (
        <div className="Dropzone"
          style={{ width: displayWidth+2*padding, height: displayHeight+2*padding}}>Loading model...</div>
      )}
      <div id="output"></div>
      <div>
        <label htmlFor="styles" className="my-4 mx-4 inline-flex text-black bg-inherit md:text-lg text-sm">Style: </label>
        <select className="border-gray-500 border-2 md:text-lg text-sm" name="styles" onChange={(e)=>setStyle(e.target.value)}>
          {styles.map((d,i) =>{return (<option key={i} value={d}>{d}</option>)})}
        </select>
      </div>
    </div>
  );
}