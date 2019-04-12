const fs = require('fs')
var trainingData = "";

function createModel() {
    const model = tf.sequential();

    model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));

    model.add(tf.layers.dense({units: 1, useBias: true}));
    return model;
}

async function run() {
    const data = await parseFile();
    const values = data.map(d => ({
        comment: d.split(" ")[0],
        score: d.split(" ") [1]
    }));
}

async function parseFile() {
    fs.readFile('train-balanced.csv', 'utf-8', (err, data) => {
        if (err) throw err;
        const temp = data.split("/n");
        trainingData = temp.map(d => ({
            cleaned: d.split("\t")[1] + " " + d.split("\t")[4]
        }));
    })

    const tensorData = converToTensor(data);
    const {inputs, labels} = tensorData;

    await trainModel(model, inputs, labels);
    console.log('Done training');

}

function converToTensor(data) {
    return tf.tidy(() => {

        tf.util.shuffle(data);

        const sarcasticComments = data.map(d => d.comment);
        const sarcasticScore = data.map(d => d.score);

        const inputTensors = tf.tensor2d(sarcasticComments, [sarcasticComments.length, 1]);
        const labelTensors = tf.tensor2d(sarcasticScore, [sarcasticScore.length, 1]);

        const inputMax = inputTensors.max();
        const inputMin = inputTensors.min();
        const labelMax = labelTensors.max();
        const labelMin = labelTensors.min();

        const normalizedInputs = inputTensors.sub(inputMin).div(inputMax.sub(inputMin));
        const normaledLabels = inputTensors.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalizedInputs,
            labels: normaledLabels,

            inputMax,
            inputMin,
            labelMax,
            labelMin
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
        callbacks: tfvis.show.fitCallbacks (
            {name: "Training performance"},
            ['loss', 'mse'],
            {height: 200, callbacks: ['onEpochEnd']}
        )
    })
}

const model = createModel();