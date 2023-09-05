const fs = require("fs/promises")
const NeuralNetwork = require("./neural-network")

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

async function main() {
    console.time("LoadCSV")
    //let [trainVal, trainArray] = csvObject('train')
    let [testVal, testArray] = await csvObject('test')
    const size = testArray[0].length
    console.timeEnd("LoadCSV")



    console.time("Layer creation")
    let network = new NeuralNetwork(size, 20, 10)
    console.timeEnd("Layer creation")
    fs.writeFile('nodes.txt', JSON.stringify(network.layers))
    fs.writeFile('biases.txt', JSON.stringify(network.biases))

    console.time('Single network calculation')
    let output = network.recognizeNumber(testArray[0], testVal[0])
    console.timeEnd('Single network calculation')
}

console.time("Program")
main().then(() => {
    console.timeEnd("Program")
})