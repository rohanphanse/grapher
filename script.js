document.addEventListener("DOMContentLoaded", () => {
    // Canvas
    const canvas = document.getElementById("canvas")
    const graphElement = document.getElementById("graph")
    graphElement.style.height = `${canvas.height}px`
    const ctx = canvas.getContext("2d")

    // Constants
    let BOX_SIZE = 10
    let POINT_SIZE = 3
    let X_RANGE = { min: -10, max: 10 }
    let Y_RANGE = { min: -7.5, max: 7.5 }
    let INTERVALS = canvas.width / BOX_SIZE
    let GRAPH_EQUATIONS = []
    let COLORS = ["black", "red", "green", "blue", "purple"]
    let SLOPE_FIELD_DATA = {
        intervals: { x: 40, y: 30 }
    }
    let VECTOR_FIELD_DATA = {
        intervals: { x: 40, y: 30 }
    }

    const positiveXMarker = document.getElementById("positive-x-marker")
    const negativeXMarker = document.getElementById("negative-x-marker")
    const positiveYMarker = document.getElementById("positive-y-marker")
    const negativeYMarker = document.getElementById("negative-y-marker")

    const plusButton = document.getElementById("plus-button")
    const minusButton = document.getElementById("minus-button")

    plusButton.addEventListener("click", () => {
        X_RANGE = { min: X_RANGE.min / 2, max: X_RANGE.max / 2 }
        Y_RANGE = { min: Y_RANGE.min / 2, max: Y_RANGE.max / 2 }
        updateMarkers()
        updateGraph()
    })

    minusButton.addEventListener("click", () => {
        X_RANGE = { min: X_RANGE.min * 2, max: X_RANGE.max * 2 }
        Y_RANGE = { min: Y_RANGE.min * 2, max: Y_RANGE.max * 2 }
        updateMarkers()
        updateGraph()
    })
    
    const equationInput = document.getElementById("equation-input")
    equationInput.addEventListener("input", () => {
        GRAPH_EQUATIONS = equationInput.value.split(";").map(e => e.trim())
        updateGraph()
    })

    document.addEventListener("keydown", (event) => {
        if (event.path[0] === document.body) {
            if (event.keyCode === 187) {
                plusButton.click()
            } else if (event.keyCode === 189) {
                minusButton.click()
            }
        }
    })

    function drawGraphLines() {
        ctx.lineWidth = 1
        for(let i = 1; i < canvas.width / BOX_SIZE; i++) {
            ctx.strokeStyle = "#d6d6d6"
            // Vertical lines
            ctx.beginPath()
            ctx.moveTo(i * BOX_SIZE + 0.5, 0)
            ctx.lineTo(i * BOX_SIZE + 0.5, canvas.height)
            ctx.stroke()
        }
        for (let i = 1; i < canvas.width / BOX_SIZE; i++) {
            // Horizontal lines
            ctx.beginPath()
            ctx.moveTo(0, i * BOX_SIZE + 0.5)
            ctx.lineTo(canvas.width, i * BOX_SIZE + 0.5)
            ctx.stroke()
        }       
            
        ctx.strokeStyle = "black"
        // Center vertical line 
        ctx.beginPath()
        ctx.moveTo(canvas.width / 2 + 0.5, 0)
        ctx.lineTo(canvas.width / 2 + 0.5, canvas.height)
        ctx.stroke()

        // Center horizontal line
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2 + 0.5)
        ctx.lineTo(canvas.width, canvas.height / 2 + 0.5)
        ctx.stroke()
    }

    function drawPoint(point, size) {
        size = size || POINT_SIZE
        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fill()
    }

    equationInput.value = "v: (x, y)"
    GRAPH_EQUATIONS = equationInput.value.split(";").map(e => e.trim())
    updateGraph()

    function canvasPosition(point) {
        const x_unit = canvas.width / (X_RANGE.max - X_RANGE.min)
        const y_unit = canvas.height / (Y_RANGE.max - Y_RANGE.min)
        return {
            x: canvas.width / 2 + point.x * x_unit,
            y: canvas.height / 2 - point.y * y_unit
        }
    }

    function graphFunction(equation, options = {}) {
        let points = []
        const width = (X_RANGE.max - X_RANGE.min) / INTERVALS
        let index = -1
        ctx.fillStyle = options.color || "black"
        ctx.strokeStyle = options.color || "black"
        for (let x = X_RANGE.min; x <= X_RANGE.max + width; x += width) {
            try {
                let cartesianPoint = {
                    x, 
                    y: calculateY(equation, x)
                }
                points.push({
                    canvasPoint: canvasPosition({
                        x, 
                        y: calculateY(equation, x)
                    }),
                    cartesianPoint
                })
                index++
                const currentPoint = points[index].canvasPoint
                drawPoint(currentPoint)
                if (index > 0) {
                    const previousPoint = points[index - 1].canvasPoint
                    ctx.beginPath()
                    ctx.lineWidth = 1
                    ctx.moveTo(previousPoint.x, previousPoint.y)
                    ctx.lineTo(currentPoint.x, currentPoint.y)
                    ctx.stroke()
                }
            } catch (err) {
                console.error(err)
            }
 
        }
        console.log(points)
    }

    function updateGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGraphLines()
        console.log(GRAPH_EQUATIONS)
        for (let i = 0; i < GRAPH_EQUATIONS.length; i++) {
            if (GRAPH_EQUATIONS[i].substring(0, 2) === "s:") {
                graphSlopeField(GRAPH_EQUATIONS[i].substring(2))
            } else if (GRAPH_EQUATIONS[i].substring(0, 2) === "v:") {
                graphVectorField(GRAPH_EQUATIONS[i].substring(2))
            } else {
                graphFunction(GRAPH_EQUATIONS[i], {
                    color: COLORS[i % COLORS.length]
                })
            }
                
        }
    }

    updateMarkers()

    function updateMarkers() {
        positiveXMarker.innerText = X_RANGE.max
        negativeXMarker.innerText = X_RANGE.min
        positiveYMarker.innerText = Y_RANGE.max
        negativeYMarker.innerText = Y_RANGE.min 
    }

    function graphSlopeField(slope_equation) {
        const intervals = SLOPE_FIELD_DATA.intervals
        let points = []
        const xStep = (X_RANGE.max - X_RANGE.min) / intervals.x
        const yStep = (Y_RANGE.max - Y_RANGE.min) / intervals.y
        let index = -1
        ctx.fillStyle = "black"
        ctx.strokeStyle = "black"
        for (let x = X_RANGE.min; x <= X_RANGE.max + xStep; x += xStep) {
            for (let y = Y_RANGE.min; y < Y_RANGE.max + yStep; y += yStep)
                try {
                    const cartesianPoint = {
                        x, 
                        y
                    }
                    const canvasPoint = canvasPosition(cartesianPoint)
                    const slope = calculateXY(slope_equation, x, y)
                    points.push({
                        cartesianPoint,
                        canvasPoint,
                        slope
                    })
                    // drawPoint(canvasPoint, 2)
                    drawSlopeFieldLine(canvasPoint, slope)
                } catch (err) {
                    console.error(err)
                }
 
        }
        console.log(points)
    }

    function drawSlopeFieldLine(point, slope) {
        let hypotenuse = Math.abs(slope)
        hypotenuse = hypotenuse < 10 ? hypotenuse : 10
        hypotenuse = hypotenuse > 5 ? hypotenuse : 5
        const angle = Math.atan(slope)
        const dx = Math.cos(angle) * hypotenuse
        const dy = Math.sin(angle) * hypotenuse
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.moveTo(point.x - dx, point.y + dy)
        ctx.lineTo(point.x + dx, point.y - dy)
        ctx.stroke()

    }


    function graphVectorField(vector_string) {
        let vector_expression
        try {
            const vector_array = vector_string.split(",").map(e => e.trim())
            console.log("VA", vector_array)
            vector_expression = {
                x: vector_array[0].substring(1),
                y: vector_array[1].substring(0, vector_array[1].length - 1)
            }
        } catch (error) {
            console.log("E", error)
            return "Invalid input"
        }
        console.log("ve:", vector_expression)
        const intervals = VECTOR_FIELD_DATA.intervals
        let points = []
        const xStep = (X_RANGE.max - X_RANGE.min) / intervals.x
        const yStep = (Y_RANGE.max - Y_RANGE.min) / intervals.y
        ctx.fillStyle = "black"
        ctx.strokeStyle = "black"
        try {
            const vector = {
                x: calculateXY(vector_expression.x, 0, 0),
                y: calculateXY(vector_expression.y, 0, 0)
            }
        } catch (error) {
            console.log("E", error)
            return
        }
        for (let x = X_RANGE.min; x <= X_RANGE.max + xStep; x += xStep) {
            for (let y = Y_RANGE.min; y < Y_RANGE.max + yStep; y += yStep)
                try {
                    const cartesianPoint = {
                        x, 
                        y
                    }
                    const canvasPoint = canvasPosition(cartesianPoint)
                    
                    const vector = {
                        x: calculateXY(vector_expression.x, x, y),
                        y: calculateXY(vector_expression.y, x, y)
                    }
                    points.push({
                        cartesianPoint,
                        canvasPoint,
                        vector
                    })
                    drawVector(canvasPoint, vector)
                } catch (err) {
                    console.error(err)
                }
 
        }
        console.log(points)
    }

    function drawVector(point, vector) {
        const slope = vector.y / vector.x
        let hypotenuse = Math.sqrt(vector.x**2 + vector.y**2)
        hypotenuse = hypotenuse < 10 ? hypotenuse : 10
        const angle = Math.atan(slope)
        const dx = Math.cos(angle) * hypotenuse
        const dy = Math.sin(angle) * hypotenuse
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.moveTo(point.x - dx, point.y + dy)
        ctx.lineTo(point.x + dx, point.y - dy)
        ctx.stroke()
        if (vector.x > 0 && vector.y > 0) {
            drawPoint({ x: point.x + dx, y: point.y - dy }, 2)
        } else if (vector.x < 0 && vector.y > 0) {
            drawPoint({ x: point.x - dx, y: point.y + dy }, 2)
        } else if (vector.x < 0 && vector.y < 0) {
            drawPoint({ x: point.x - dx, y: point.y + dy }, 2)
        } else {
            drawPoint({ x: point.x + dx, y: point.y - dy }, 2)
        } 
    }
})

function calculateY(equation, x) {
    return eval(equation.replaceAll("x", `(${x})`))
}

function calculateXY(equation, x, y) {
    return eval(equation.replaceAll("x", `(${x})`).replaceAll("y", `(${y})`)) 
}