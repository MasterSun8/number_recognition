/*
    * Neural Network Class
    * This class implements a simple feedforward neural network with backpropagation.
*/
class NeuralNetwork {
    /*
     * Constructor for the NeuralNetwork class.
        * @param {...*} args - The arguments for the constructor.
        * If the first argument is true, it initializes the network with the given layers and biases.
        * Otherwise, it creates the layers and biases based on the provided sizes.
        * @param {boolean} args[0] - If true, initializes the network with the given layers and biases.
        * @param {Array} args[1] - The layers of the network.
        * @param {Array} args[2] - The biases of the network.
        * @param {...number} args - The sizes of the layers in the network.
        * @returns {NeuralNetwork} - An instance of the NeuralNetwork class
    */
    constructor(...args) {
        if (args[0] === true) {
            this.layers = args[1]
            this.biases = args[2]
        } else {
            [this.biases, this.layers] = this.makeLayers(...args)
        }
    }

    static activation(x) {
        return x > 0 ? x : 0
    }

    visualize() {
        console.log("Layers: ")
        this.layers.forEach((layer, index) => {
            console.log(`Layer ${index}: ${layer.length}`)
        })
        console.log("Biases: ")
        this.biases.forEach((bias, index) => {
            console.log(`Bias ${index}: ${bias.length}`)
        })
        console.log("Layers size: " + this.layers.length)
        console.log("Biases size: " + this.biases.length)
    }

    /*
        * Creates an array of random numbers between -0.5 and 0.5.
        * @param {number} size - The size of the array to create.
        * @returns {Array} - An array of random numbers.
    */
    randomArray(size) {
        let arr = new Array()
        for (let i = 0; i < size; i++) {
            arr.push(Math.random() - 0.5)
        }
        return arr
    }

    /* 
        * Creates an array of random biases for the given count.
        * @param {number} count - The number of biases to create.
        * @returns {Array} - An array of random biases.
    */
    createBiases(count) {
        let biases = new Array()
        for (let c = 0; c < count; c++) {
            biases.push(Math.random() - 0.2)
        }
        return biases
    }

    /*
        * Creates a layer of random connections between nodes.
        * @param {number} conns - The number of connections in the layer.
        * @param {number} nodes - The number of nodes in the layer.
        * @returns {Array} - An array representing the layer of connections.
    */
    createLayer(conns, nodes) {
        let layer = new Array()
        for (let c = 0; c < nodes; c++) {
            layer.push(this.randomArray(conns))
        }
        return layer
    }

    /*
        * Creates layers and biases for the neural network.
        * @param {...number} args - The sizes of the layers in the network.
        * @returns {Array} - An array containing the biases and layers of the network.
    */
    makeLayers(...args) {
        let before = args.shift()
        let layers = new Array()
        args.forEach(count => {
            layers.push(this.createLayer(before, count))
            before = count
        })
        let biases = new Array()
        args.forEach(x => {
            biases.push(this.createBiases(x))
        })
        return [biases, layers]
    }

    /*
        * Calculates the output of a layer given the input, weights, and biases.
        * @param {Array} input - The input to the layer.
        * @param {Array} output - The weights of the layer.
        * @param {Array} biases - The biases of the layer.
        * @returns {Array} - The output of the layer.
    */
    calculateLayer(input, output, biases) {
        let inputSize = input.length
        if (inputSize != output[0].length) {
            throw new Error(`The layer size is not equal: expected ${output[0].length} in the first layer but it's ${inputSize}`)
        }

        let finalOutput = new Array()
        let sum = 0

        for (let i = 0; i < output.length; i++) {
            let result = 0
            for (let index = 0; index < inputSize; index++) {
                result += output[i][index] * input[index]
            }
            result = this.constructor.activation(result + biases[i])
            sum += result
            finalOutput.push(result)
        }

        // finalOutput = finalOutput.map((x) => {
            // return x / sum
        // })
        return finalOutput
    }

    /*
        * Calculates the output of the neural network given the input.
        * @param {Array} input - The input to the network.
        * @returns {Array} - The output of the network.
    */
    forwardProp(input) {
        for (let layer = 0; layer < this.layers.length; layer++) {
            input = this.calculateLayer(input, this.layers[layer], this.biases[layer])
        }
        return input
    }

    /*
        * Calculates the output of the neural network for each layer given the input.
        * @param {Array} input - The input to the network.
        * @returns {Array} - An array containing the output of each layer.
    */
    calculateNetwork(input){
        let table = [input]
        for (let layer = 0; layer < this.layers.length; layer++) {
            input = this.calculateLayer(input, this.layers[layer], this.biases[layer])
            table.push(input)
        }
        return table
    }

    /*
        * Gets the index of the maximum value in an array.
        * @param {Array} input - The input array.
        * @returns {number} - The index of the maximum value in the array.
    */
    getNumber(input){
        let result = input.indexOf(Math.max(...input))
        return result
    }

    /*
        * Tests the output of the network against the expected value.
        * @param {Array} input - The output of the network.
        * @param {number} trueValue - The expected value.
        * @returns {boolean} - True if the output matches the expected value, false otherwise.
    */
    test(input, trueValue){
        let res = this.getNumber(input)
        return res==trueValue
    }

    /*
        * Recognizes a number from the input array.
        * @param {Array} input - The input array.
        * @param {number} trueValue - The expected value.
        * @returns {number} - The recognized number.
    */
    recognizeNumber(input, trueValue = false) {
        let result = this.getNumber(this.forwardProp(input))
        if (trueValue) {
            console.log(`The result is: ${result} expected ${trueValue}`)
        }
        return result
    }

    /*
        * Reshapes the layer of the neural network.
        * @returns {Void}
    */
    reshapeLayer(){
        
    }

    /*
        * Backpropagation function to update the weights and biases of the network.
        * @param {Array} output - The output of the network.
        * @returns {Void}
    */
    backProp(output) {
        // console.log(output.length)
        for(let i=0; i<output[output.length-1].length; i++){
            
        }
        
        /*
            [784, 16, 16, 10]
              X   X   X   X
            [ 1, 784, 16, 16]
            [784, 16, 16, 10]
        */
    }

    /*
        * Iterates through the inputs and values to train the network.
        * @param {Array} inputs - The input data.
        * @param {Array} values - The expected output values.
        * @returns {number} - The number of successful predictions.
    */
    iterate(inputs, values){
        let success = 0
        console.time("Full iteration")
        for(let i = 0; i<15; i++){
            let result = this.calculateNetwork(inputs[i])
            success = this.test(result[result.length-1], values[i]) ? ++success : success
            this.backProp(result)
        }
        console.timeEnd("Full iteration")
        return success
    }

    /*
        * Trains the network using the provided inputs and values.
        * @param {Array} inputs - The input data.
        * @param {Array} values - The expected output values.
        * @returns {Void}
    */
    train(inputs, values){
        console.log(this.iterate(inputs, values)/inputs.length*100 + "%")
    }
}

module.exports = NeuralNetwork