function valueToDecimal(value) {
  return parseFloat("0." + value.toString())
}

const encrypt = (codee, text, layers = 1) => {
  var result = (text).split("").map(e => e.charCodeAt(0))
  var code = codee.split("").map(e => e.charCodeAt(0))

  //xor
  let lastChar = 1
  let tempChar = 1
  for (var i = 0; i < result.length; i++) {
    tempChar = result[i]
    for (let i2 = 0; i2 < code.length * layers; i2++) {
      result[i] = (result[i] ^ code[(i2) % code.length])
    }
    lastChar = tempChar
  }

  //shuffle using code so that you can unshuffle it
  // for (let i = 0; i < result.length * layers; i++) {
  //   let where = code[i % code.length] % result.length
  //   result.splice(where, 0, result.shift())
  // }

  return result
}
const decrypt = (codee, text, layers = 1) => {
  var result = text
  var code = codee.split("").map(e => e.charCodeAt(0))

  //unshuffle
  // for (let i = 0; i < result.length * layers; i++) {
  //   let where = code[i % code.length] % result.length
  //   let data = result.splice(where + 1, 1)
  //   result.unshift(data)
  // }

  //reverse xor
  let lastChar = 1
  for (var i = 0; i < result.length; i++) {
    for (let i2 = 0; i2 < code.length * layers; i2++) {
      result[i] = (result[i] ^ code[(i2) % code.length])
    }
    lastChar = result[i]
  }
  return result.map(e => String.fromCharCode(e)).join("")
}