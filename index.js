const fs = require("fs/promises")

const activation = (x) => x > 0 ? x : 0

function randomArray(size) {
    let arr = new Array()
    for (let i = 0; i < size; i++) {
        arr.push(Math.round(Math.random() - 0.5))
    }
    return arr
}

function dotProd(arr1, arr2) {
    if (!x?.length || x.length != y.length) {
        throw new Error("Arrays are of different length")
    }
    let prod = 0
    arr1.forEach((x, i) => {
        prod += x * arr2[i]
    })
    return prod
}

function createBiases(count) {
    let biases = new Array()
    for (let c = 0; c < count; c++) {
        biases.push(Math.random() * 5)
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
    let before = 1
    let layers = new Array()
    args.forEach(count => {
        layers.push(createLayer(before, count))
        before = count
    })
    args.pop()
    args.shift()
    let biases = new Array()
    args.forEach(x => {
        biases.push(createBiases(x))
    })
    return [biases, layers]
}

async function csvObject(name) {
    let arr = new Array()
    let val = new Array()
    let file = await fs.readFile('mnist_' + name + '.csv', 'utf8')
    let temp = file.split("\r\n")
    temp.forEach(row => {
        let t = row.split(",")
        val.push(t.shift())
        t = t.map(x => parseInt(x, 10))
        /*Math.round(parseInt(x, 10) / 255 * 1) / 1)
        let tem = new Array()
        for(let i = 0; i<t.length; i+=28){
            tem.push(t.slice(i, i+28))
        }
        /**/
        arr.push(t)
    })
    return [val, arr]
}

async function main() {
    //let [trainVal, trainArray] = csvObject('train')
    let [testVal, testArray] = await csvObject('test')
    const size = testArray[0].length
    let val

    let num = process.argv[2]
    val = num = num ? num : 0

    /*
    console.log(val ? testVal[num] : '')
    console.log(testArray[num])
    /**/
    let [biases, layers] = makeLayers(size, 15, 10)
    //console.log(biases)
    fs.writeFile('nodes.txt', JSON.stringify(layers))
    fs.writeFile('biases.txt', JSON.stringify(biases))

    
}

/*    
    let string = ''
    let temp = '|'
    testArray[num].forEach(e => {
        temp = '|'
        e.forEach((el, i) => {
            spaces = el.length
            spaces = 2-spaces
            let val = '\u001b[38;5;' + el*255 + 'm'
            temp += val
            temp += ' '.repeat(spaces)
            temp += el
        })
        temp += ' |'
        string += temp + '\n'
    })
    console.log(string)
/**/

main()