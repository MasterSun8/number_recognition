const fs = require("fs/promises")

const activation = (x) => x > 0 ? x : 0

async function csvObject(name) {
    let arr = new Array()
    let val = new Array()
    let file = await fs.readFile('mnist_' + name + '.csv', 'utf8')
    let temp = file.split("\r\n")
    temp.forEach(row => {
        let t = row.split(",")
        val.push(t.shift())
        t = t.map(x => parseInt(x, 10) / 255)
        arr.push(t)
    })
    return [val, arr]
}

function randomArray(size) {
    let arr = new Array()
    for (let i = 0; i < size; i++) {
        arr.push(Math.random() - 0.5)
    }
    return arr
}

function createBiases(count) {
    let biases = new Array()
    for (let c = 0; c < count; c++) {
        biases.push(Math.random() - 0.2)
    }
    return biases
}

function createLayer(conns, nodes) {
    let layer = new Array()
    for (let c = 0; c < nodes; c++) {
        layer.push(randomArray(conns))
    }
    return layer
}

function makeLayers(...args) {
    let before = args.shift()
    let layers = new Array()
    args.forEach(count => {
        layers.push(createLayer(before, count))
        before = count
    })
    let biases = new Array()
    args.forEach(x => {
        biases.push(createBiases(x))
    })
    return [biases, layers]
}

function calculateLayer(input, output, biases) {
    let inputSize = input.length
    if (input.length != output[0].length) {
        throw new Error(`The layer size is not equal: expected ${output[0].length} in the first layer but it's ${inputSize}`)
    }

    let finalOutput = new Array()
    let sum = 0

    for (let i = 0; i < output.length; i++) {
        let result = 0
        for (let index = 0; index < inputSize; index++) {
            result += output[i][index] * input[index]
        }
        result = activation(result + biases[i])
        sum += result
        finalOutput.push(result)
    }

    finalOutput = finalOutput.map((x) => {
        return x / sum
    })
    return finalOutput
}

function recognizeNumber(input, layers, biases, trueValue) {
    let lay = calculateLayer(input, layers[0], biases[0])
    let layer = 1
    for (; layer < layers.length; layer++) {
        lay = calculateLayer(lay, layers[layer], biases[layer])
    }
    let result = lay.indexOf(Math.max(...lay))
    console.table(lay)
    console.log(`The result is: ${result} expected ${trueValue}`)
    return lay
}

async function main() {
    console.time("LoadCSV")
    //let [trainVal, trainArray] = csvObject('train')
    let [testVal, testArray] = await csvObject('test')
    const size = testArray[0].length
    console.timeEnd("LoadCSV")

    console.time("Layer creation")
    let [biases, layers] = makeLayers(size, 20, 10)
    console.timeEnd("Layer creation")
    fs.writeFile('nodes.txt', JSON.stringify(layers))
    fs.writeFile('biases.txt', JSON.stringify(biases))

    console.time('Single network calculation')
    let output = recognizeNumber(testArray[0], layers, biases, testVal[0])

    console.timeEnd('Single network calculation')
}

console.time("Program")
main().then(() => {
    console.timeEnd("Program")
})