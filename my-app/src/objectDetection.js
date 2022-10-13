//==============================================================================
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// =============================================================================

import { names,labels } from './data';

const tf = require('@tensorflow/tfjs');

export function yoloV5(path){
    if(!(this instanceof ObjectDetection)) return new ObjectDetection(path);
}

export class ObjectDetection {

    constructor(path){
        //path to your custom yolov5 model
        this.modelPath = `/web_models/${path}/model.json`;
        //set proper list of categories for each model
        path === "model_3" ? this.categories = labels : this.categories = names;
        
    }

    async load() {

        this.model = await tf.loadGraphModel(this.modelPath);
        //Warm up the model for faster inference:
        const zeroTensor = tf.zeros([1,640,640,3], 'float32');
        const result = await this.model.executeAsync(zeroTensor);

        await Promise.all(result.map(t=>t.data()));

        result.map(t=>t.dispose());

        zeroTensor.dispose();
        
        console.log(this.modelPath, " loaded!");

        return this
    }

    async infer(img){

        const batched = tf.tidy(()=>{
            //adjust image to model size
            return tf.image.resizeBilinear(tf.browser.fromPixels(img), [640, 640]) 
            .div(255.0).expandDims(0);

        });

        //const height = batched.shape[1];
        //const width = batched.shape[2];
        const height = img.height;
        const width = img.width;
        const result = await this.model.executeAsync(batched);
        const boxes = result[0].dataSync();
        const scores = result[1].dataSync();
        const indices = result[2].dataSync();
        const valids = result[3].dataSync();

        batched.dispose();
        tf.dispose(result);

        const prevBackend = tf.getBackend();
        /*
        if (tf.getBackend() === 'webgl'){
            tf.setBackend('cpu');
        }
        */
        tf.setBackend('webgl');
        
        if(prevBackend !== tf.getBackend()){
            tf.setBackend(prevBackend);
        }

        return this.buildDetectedObjects(width, height, boxes, scores, indices, valids);
    }

    buildDetectedObjects(width, height, boxes, scores, indices, valids){

        const objects = [];

        for (let i = 0; i < valids; ++i){
            const bbox = [];
            let [x1, y1, x2, y2] = boxes.slice(i * 4, (i + 1) * 4);
            x1 *= width;
            x2 *= width;
            y1 *= height;
            y2 *= height;

            const w = x2 - x1;
            const h = y2 - y1;
    
            bbox[0]=x1;
            bbox[1]=y1;
            bbox[2]=w;
            bbox[3]=h;
            const klass = this.categories[indices[i]];
            //const klass = names[indices[i]];
            const score = scores[i].toFixed(2);
    
            objects.push({
              bbox: bbox,
              class: klass,
              score: score
            });
        }
      
        return objects;
    }

    detect(img){

        return this.infer(img);
    }

    dispose(){

        if (this.model != null){
            this.model.dispose();
        }
    }
}