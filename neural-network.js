class NeuralNetwork {
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

    randomArray(size) {
        let arr = new Array()
        for (let i = 0; i < size; i++) {
            arr.push(Math.random() - 0.5)
        }
        return arr
    }

    createBiases(count) {
        let biases = new Array()
        for (let c = 0; c < count; c++) {
            biases.push(Math.random() - 0.2)
        }
        return biases
    }

    createLayer(conns, nodes) {
        let layer = new Array()
        for (let c = 0; c < nodes; c++) {
            layer.push(this.randomArray(conns))
        }
        return layer
    }

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

    calculateLayer(input, output, biases) {
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
            result = this.constructor.activation(result + biases[i])
            sum += result
            finalOutput.push(result)
        }

        finalOutput = finalOutput.map((x) => {
            return x / sum
        })
        return finalOutput
    }

    forwardProp(input) {
        let lay = this.calculateLayer(input, this.layers[0], this.biases[0])
        for (let layer = 1; layer < this.layers.length; layer++) {
            lay = this.calculateLayer(lay, this.layers[layer], this.biases[layer])
        }
        return lay
    }

    recognizeNumber(input, trueValue = false) {
        let lay = this.forwardProp(input, this.layers, this.biases)
        let result = lay.indexOf(Math.max(...lay))
        if (trueValue) {
            console.log(`The result is: ${result} expected ${trueValue}`)
        }
        return result
    }

    backProp(output) {
        
    }

}

module.exports = NeuralNetwork