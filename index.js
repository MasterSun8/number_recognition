const fs = require("fs/promises")
const NeuralNetwork = require("./neural-network")

/*
    * Open a CSV file and convert it to an array of objects.
    * @param {string} name - The name of the CSV file to open.
    * @returns {Array} - An array of objects representing the CSV file.
*/
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
    /*
    let [trainVal, trainArray] = await csvObject('train')
    let [testVal, testArray] = await csvObject('test')
    const size = testArray[0].length
    /**/
    let [val, array] = await csvObject('train')
    const size = array[0].length
    console.timeEnd("LoadCSV")

    console.log("Size: " + size)
    console.log("Amount of elements: " + array.length)
    
    console.time("Layer creation")
    let network = new NeuralNetwork(size, 16, 16, 10)
    console.timeEnd("Layer creation")
    fs.writeFile('nodes.txt', JSON.stringify(network.layers))
    fs.writeFile('biases.txt', JSON.stringify(network.biases))

/*
    console.time('Single network calculation')
    let output = network.recognizeNumber(array[0], val[0])
    console.timeEnd('Single network calculation')
/**/

    // network.visualize()

    console.time("Train")
    // network.backProp(network.calculateNetwork(network.randomArray(size)))
    network.train(array, val)
    console.timeEnd("Train")
}

console.time("Program")
main().then(() => {
    console.timeEnd("Program")
})