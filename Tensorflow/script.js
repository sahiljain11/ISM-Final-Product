const fs = require('fs');
const util = require('util');
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');
const tf = require('@tensorflow/tfjs');

//import * as tf from '@tensorflow/tfjs-node';
require('@tensorflow/tfjs-node');
    
var trainingData = "";

function createModel() {
    const model = tf.sequential();

    model.add(tf.layers.dense({inputShape: [100], units: 1, useBias: true}));

    model.add(tf.layers.dense({units: 1, useBias: true}));
    return model;
}

async function parseFile() {
    data = await readFile('vectors.csv');
    const temp = data.split("\r\n");
    
    trainingData = temp.map(d => ({
	score: d.substring(0, 1),
	comment: d.substring(2)
    }));
    
    return trainingData;
}

async function converToTensor(data) {
    return tf.tidy(() => {
        tf.util.shuffle(data);
        
        console.log("Starting to map");

        const sarcasticComments = data.map(function(d) {
            var splitted = d.comment.split(" ");
            var cleaned = splitted.map(function(element) {
                return parseInt(element, 10);
            });
            return cleaned;
        });
        
        //console.log(sarcasticComments);
        const sarcasticScore = data.map(d => parseInt(d.score));
        console.log("Done with mapping"); 
        sarcasticComments.pop();
        sarcasticScore.pop();

        console.log("Starting to create tensors");  

        const commentTensors = tf.tensor2d(sarcasticComments);
        const scoreTensors = tf.tensor2d(sarcasticScore);

        console.log("Finished creating tensors");  

        //const inputMax = inputTensors.max();
        //const inputMin = inputTensors.min();
        //const scoreMax = scoreTensors.max();
        //const scoreMin = scoreTensors.min();

        //const normalizedInputs = inputTensors.sub(inputMin).div(inputMax.sub(inputMin));
        //const scoresNormalized = scoresTensors.sub(scoreMin).div(scoreMax.sub(scoreMin));

        return {
            inputs: commentTensors,
            labels: scoreTensors,
        }
    });
}

async function trainModel(model, inputs, labels) {
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    })

    const batchSize = 28;
    const epochs = 50;

    return await model.fit(inputs, labels, {
        batchSize,
        epochs, 
        shuffle: true,
        callbacks: (epoch, log) => console.log('Epoch $(epoch): loss = $(log.loss)')
    })
}

async function run() {
        
    var model = createModel();
    data = await parseFile();
    const tensorData = converToTensor(data);
    const {inputs, labels} = tensorData;

    await trainModel(model, inputs, labels);
    console.log('Done training');
}

run();
