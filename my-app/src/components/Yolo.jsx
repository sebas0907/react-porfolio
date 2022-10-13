import React, { useEffect, useState, useRef, useCallback} from "react";
import { yoloV5 } from "../objectDetection";
import Webcam from "react-webcam";
import { BrowserView } from 'react-device-detect';
import Detector from "./Detector";
import * as mobilenet from "@tensorflow-models/mobilenet";

export default function Yolo() {

    const [model, setModel] = useState();
    const [modelPath, setModelPath] = useState("model_2"); 
    const [preview, setPreview] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [cameraId, setCameraId] = useState();
    const [mode, setMode] = useState("user");
    const [isVideo, setIsVideo] = useState(true)
    const [source, setSource] = useState("");
    const [classification, setClassification] = useState(false);
    const webcamRef = useRef();
    
    const displayWidth = 400;
    const displayHeight = 400;
    const padding = 5;
    
    const onDrop = (accepted, rejected, links) => {
      const source = (accepted[0].preview || links[0]);
      setSource(source)
    };

    const loadModel = async () => {
        try {
          //const model = await yoloV5(path).load();
          const model = classification? await mobilenet.load({version:2, alpha:1.00}) : await yoloV5(modelPath).load();
          //const model = await cocoSsd.load();
          setModel(model);
          if (classification) console.log("Mobilenet ready");
        } catch (err) {
          console.log(err);
          console.log("Failed to load model!");
        }
      }

    const handleDevices = useCallback( mediaDevices => {
        setCameras(mediaDevices.filter(({ kind }) => kind === "videoinput"));
        setCameraId(mediaDevices.filter(({ kind }) => kind === "videoinput").map(d=>d.deviceId)[0]) 
    },[setCameras, setCameraId]);
    
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },[handleDevices]);
    
    useEffect(() => {
        //tf.ready().then(()=> loadModel())
        loadModel();
    }, [modelPath, classification]);
    
    useEffect(()=>{
        return ()=>{}
    },[]);
    
    const videoOptions={
        width: displayWidth,
        height: displayHeight,
        facingMode: { exact:mode },
        deviceId: cameraId
    }

    const startCapture = async () => {
        await setPreview(true);
        videoChecker();
    }

    const videoChecker = () => {
        const video = document.getElementById("vid");
        setTimeout(()=>{
            if (video.readyState === 4){
                //clearInterval(checker)
                console.log('video is ready');
                video.width = video.videoWidth;
                video.height = video.videoHeight;
                classification? classify(video): detect(video);
                //detect(video);
 
            }
        },2500)
    }

    const detect = (video) => {
        model.detect(video).then(predictions => {       
            //setPreds(predictions);
            if (predictions) {
                draw(video, predictions);
            }
            detect(video);
        });
    }

    const classify = (video) => {
        model.classify(video, 1).then(predictions => {

            const c = document.getElementById("canvas");
            const ctx = c.getContext("2d");
            ctx.drawImage(video,0,0,video.width,video.height);
            const font = "18px courier";
            ctx.fillStyle = "rgba(0,255,255,0.5)"//"#00FFFF";
            ctx.font = font;
            ctx.textBaseline = "top";
            predictions.map(p => {
                ctx.fillText(p.className + ":" + p.probability.toFixed(2), 5, 5);  
            });
            classify(video);
        })
    }

    const startClassification = () => {
        setClassification(true);
        //loadModel();
    }

    const draw = (video, predictions) => {

        const c = document.getElementById("canvas");
        const ctx = c.getContext("2d");
        ctx.drawImage(video,0,0,video.width,video.height);

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
    }

    const changeStream = (facingMode) => {
        facingMode==="user" ? setMode("environment"): setMode("user");
      }

    const toggleModel = (Path) => {
        setClassification(false);
        setModelPath(Path);
        //loadModel(Path);
    }

    const changeCamera = (e) => {
        setCameraId(e.target.value);
        //console.log(e.target.value);
    }

    return (<>
    {isVideo ? (
        <div className="Dropzone-page">
            {preview? (<></>): (<div>
            <button onClick={()=>startClassification()} className="my-4 mx-2 inline-flex text-black border-2 border-pink-800 py-2 px-6 focus:outline-none hover:border-pink-500 rounded md:text-lg text-sm">classify</button>
            <button onClick={()=>setIsVideo(false)} className="my-4 mx-2 inline-flex text-black border-2 border-green-800 py-2 px-6 focus:outline-none hover:border-green-500 rounded md:text-lg text-sm" >Use {isVideo ? "Photo":"Video"}</button>
            </div>)}
            <div className="Dropzone">
            {preview ? (
                <>
                    <Webcam id="vid" 
                    audio={false} 
                    screenshotFormat="image/jpeg" 
                    ref={webcamRef} 
                    videoConstraints={videoOptions} 
                    width={displayWidth+"px"}
                    height={displayHeight+"px"}
                    style={{width: "400px", height: "400px"}}/>
                    <canvas id="canvas" width={displayWidth} height={displayHeight} onClick={()=> window.location.reload()} />

                </>
            ) : (
                <div className="Dropzone"
                style={{ width: displayWidth+2*padding, height: displayHeight+2*padding}} onClick={startCapture}>{model ? "Press to start detection!":"Loading model..."}</div>
            )}
            </div>
            {preview ? (<></>):(<div className="flex md:flex-row flex-col">
            <button className="my-4 mx-2 inline-flex text-white bg-blue-800 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded md:text-lg text-sm" onClick={()=>changeStream(mode)}>Camera mode set to: {mode}</button>
            {modelPath ==="model_2" ? (<button className="my-4 mx-2 inline-flex text-white bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded md:text-lg text-sm" onClick={()=>{toggleModel("model_3")}}>Toggle Model: {modelPath}</button>)
            :(<button className="my-4 mx-2 inline-flex text-white bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded md:text-lg text-sm" onClick={()=>{toggleModel("model_2")}}>Toggle Model: {modelPath}</button>)}
            </div>)}
            <BrowserView>
            {preview ? (<></>):(<div>
                <label htmlFor="cameras" className="my-4 mx-4 inline-flex text-black bg-inherit md:text-lg text-sm">Device: </label>
                <select className="border-gray-500 border-2 md:text-lg text-sm" name="cameras" onChange={(e)=>changeCamera(e)}>
                {cameras.map((d,i) =>{return (<option key={i} selected={i===0 ? "selected" : false} value={d.deviceId}>{d.label}</option>)})}
                </select></div>)}
            </BrowserView>
        </div>) : (<>
        <Detector model={model} source={source} classification={classification} setIsVideo={setIsVideo} isVideo={isVideo} onDrop={onDrop} displayWidth={displayWidth} displayHeight={displayHeight} padding={padding} /></>)
    }</>);
    
}