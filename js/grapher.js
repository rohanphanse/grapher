class Grapher {
    constructor (params = {}) {
        // Parent element
        this.parent = params.parent
        this.height = params.height 
        this.width = params.width
        console.log(this.width, this.height)
        // DOM elements
        this.create()
        this.input = document.getElementById(`${this.parent.id}-input`)
        this.zoomOutButton = document.getElementById(`${this.parent.id}-zoom-out-button`)
        this.zoomInButton = document.getElementById(`${this.parent.id}-zoom-in-button`)
        this.posXMarker = document.getElementById(`${this.parent.id}-pos-x-marker`)
        this.negXMarker = document.getElementById(`${this.parent.id}-neg-x-marker`)
        this.posYMarker = document.getElementById(`${this.parent.id}-pos-y-marker`)
        this.negYMarker = document.getElementById(`${this.parent.id}-neg-y-marker`)
        // Canvas
        this.canvas = document.getElementById(`${this.parent.id}-canvas`)
        this.ctx = this.canvas.getContext("2d")
        // Graph properties
        this.box_size = 10
        this.x_range = { min: -10, max: 10 }
        this.y_range = { min: -10 * (this.height / this.width), max: 10 * (this.height / this.width) }
        this.function_intervals = 1000
        this.field_intervals = 20
        this.slope_intervals = { x: this.width / this.field_intervals, y: this.height / this.field_intervals }
        this.vector_intervals = { x: this.width / this.field_intervals, y: this.height / this.field_intervals }
        this.polar_range = { min: 0, max: 2*Math.PI }
        this.polar_intervals = 500
        this.parametric_range = { min: -10, max: 10 }
        this.parametric_intervals = 1000
        this.expressions = []
        this.colors = ["black", "red", "green", "blue", "purple"]
        console.log(this.parent.id, this)
        // Listeners
        this.addListeners()
        // Draw graphs
        this.updateAxisMarkers()
        this.drawGraphs()
    }

    create() {
        // Parent
        this.parent.className = "grapher"
        this.parent.style.height = `${this.height}px`
        this.parent.style.width = `${this.width}px`
        // Bar
        const bar = document.createElement("div")
        bar.className = "grapher-bar"
        // Input 
        const input = document.createElement("input")
        input.id = `${this.parent.id}-input`
        input.className = "grapher-input"
        input.placeholder = "Enter function(s), slope field(s), and vector field(s)"
        // Zoom buttons
        const zoomInButton = document.createElement("div")
        zoomInButton.id = `${this.parent.id}-zoom-in-button`
        zoomInButton.className = "grapher-zoom-button"
        zoomInButton.innerText = "+"
        const zoomOutButton = document.createElement("div")
        zoomOutButton.id = `${this.parent.id}-zoom-out-button`
        zoomOutButton.className = "grapher-zoom-button"
        zoomOutButton.innerText = "-"
        // Graph
        const graph = document.createElement("div")
        graph.className = "grapher-graph"
        graph.style.height = `${this.height}px`
        graph.style.width = `${this.width}px`
        // Canvas
        const canvas = document.createElement("canvas")
        canvas.className = "grapher-canvas"
        canvas.id = `${this.parent.id}-canvas`
        canvas.height = this.height
        canvas.width = this.width
        // Axis markers
        const posXMarker = document.createElement("div")
        posXMarker.id = `${this.parent.id}-pos-x-marker`
        posXMarker.className = "grapher-pos-x-marker"
        const negXMarker = document.createElement("div")
        negXMarker.id = `${this.parent.id}-neg-x-marker`
        negXMarker.className = "grapher-neg-x-marker"
        const posYMarker = document.createElement("div")
        posYMarker.id = `${this.parent.id}-pos-y-marker`
        posYMarker.className = "grapher-pos-y-marker"
        const negYMarker = document.createElement("div")
        negYMarker.id = `${this.parent.id}-neg-y-marker`
        negYMarker.className = "grapher-neg-y-marker"
        // Append to DOM
        bar.append(input)
        bar.append(zoomInButton)
        bar.append(zoomOutButton)
        graph.append(canvas)
        graph.append(posXMarker)
        graph.append(negXMarker)
        graph.append(posYMarker)
        graph.append(negYMarker)
        this.parent.append(bar)
        this.parent.append(graph)
    }

    addListeners() {
        this.zoomOutButtonListener = ["click", () => {
            this.x_range = { min: this.x_range.min * 2, max: this.x_range.max * 2 }
            this.y_range = { min: this.y_range.min * 2, max: this.y_range.max * 2 }
            this.updateAxisMarkers()
            this.drawGraphs()
        }]
        this.zoomInButtonListener = ["click", () => {
            this.x_range = { min: this.x_range.min / 2, max: this.x_range.max / 2 }
            this.y_range = { min: this.y_range.min / 2, max: this.y_range.max / 2 }
            this.updateAxisMarkers()
            this.drawGraphs()
        }]
        this.inputListener = ["input", () => {
            this.expressions = this.input.value.split(";").map(e => e.trim()).filter(e => e.length)
            this.drawGraphs()
        }]
        this.keyListener = ["keydown", (event) => {
            console.log(event.keyCode)
            if (event.path[0] === document.body) {
                if (event.keyCode === 187) {
                    this.zoomInButton.click()
                } else if (event.keyCode === 189) {
                    this.zoomOutButton.click()
                }
            }
        }]
        this.zoomOutButton.addEventListener(...this.zoomOutButtonListener)
        this.zoomInButton.addEventListener(...this.zoomInButtonListener)
        this.input.addEventListener(...this.inputListener)
        document.body.addEventListener(...this.keyListener)
    }

    removeListeners() {
        this.zoomOutButton.removeEventListener(...this.zoomOutButtonListener)
        this.zoomInButton.removeEventListener(...this.zoomInButtonListener)
        this.input.removeEventListener(...this.inputListener)
        document.body.removeEventListener(...this.keyListener)
    }

    drawGraphLines() {
        const x_offset = (this.width / 2) % this.box_size
        const y_offset = (this.height / 2) % this.box_size
        this.ctx.lineWidth = 1
        for(let i = 0; i < this.width / this.box_size; i++) {
            this.ctx.strokeStyle = "#d6d6d6"
            // Vertical lines
            this.ctx.beginPath()
            this.ctx.moveTo(i * this.box_size + 0.5 + x_offset, 0)
            this.ctx.lineTo(i * this.box_size + 0.5 + x_offset, this.height)
            this.ctx.stroke()
        }
        for (let i = 0; i < this.height / this.box_size; i++) {
            // Horizontal lines
            this.ctx.beginPath()
            this.ctx.moveTo(0, i * this.box_size + 0.5 + y_offset)
            this.ctx.lineTo(this.width, i * this.box_size + 0.5 + y_offset)
            this.ctx.stroke()
        }       
        this.ctx.strokeStyle = "black"
        // Center vertical line 
        this.ctx.beginPath()
        this.ctx.moveTo(this.width / 2 + 0.5, 0)
        this.ctx.lineTo(this.width / 2 + 0.5, this.height)
        this.ctx.stroke()
        // Center horizontal line
        this.ctx.beginPath()
        this.ctx.moveTo(0, this.height / 2 + 0.5)
        this.ctx.lineTo(this.width, this.height / 2 + 0.5)
        this.ctx.stroke()
    }

    drawGraphs() {
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.drawGraphLines()
        console.log(this.expressions)
        for (let i = 0; i < this.expressions.length; i++) {
            const split_equals = this.expressions[i].split("=").map(e => e.trim())
            console.log("equals", split_equals)
            if (this.expressions[i].substring(0, 2) === "s:") {
                this.graphSlopeField(this.expressions[i].substring(2))
            } else if (this.expressions[i].substring(0, 2) === "v:") {
                this.graphVectorField(this.expressions[i].substring(2))
            } else if (this.expressions[i].substring(0, 2) === "p:") {
                const expressions = {}
                let options = {}
                options.color = this.colors[i % this.colors.length]
                const split_comma = this.expressions[i].split(",")
                expressions.x = split_comma[0].split("=")[1]
                expressions.y = split_comma[1].split("=")[1]
                if (this.expressions[i].includes("[")) {
                    console.log(",", split_comma[1])
                    options.range = this.parseRange(split_comma[1] + "," + split_comma[2])
                    expressions.y = split_comma[1].split("=")[1].split("[")[0]
                }
                console.log("expression", expressions)
                this.graphParametric(expressions, options)
            } else if (split_equals.length === 2 && split_equals[0] === "r") {
                let options = {}
                options.color = this.colors[i % this.colors.length]
                console.log("OPTIONS", options)
                let expression = split_equals[1]
                if (split_equals[1].includes("[")) {
                    options.range = this.parseRange(split_equals[1])
                    expression = split_equals[1].substring(0, split_equals[1].indexOf("["))
                }
                this.graphPolar(expression, options)
            } else {
                this.graphFunction(this.expressions[i], {
                    color: this.colors[i % this.colors.length]
                })
            }
        }
    }

    graphFunction(expression, options = {}) {
        let code
        try {
            const node = math.parse(expression)
            code = node.compile()
            console.log("code", node, code, code.evaluate({ x: 1 }))
        } catch (error) {
            console.log(error)
            return
        }
        let points = []
        const dx = (this.x_range.max - this.x_range.min) / this.function_intervals
        let index = -1
        console.log("dx", dx)
        this.ctx.fillStyle = options.color || "black"
        this.ctx.strokeStyle = options.color || "black"
        for (let x = this.x_range.min; x <= this.x_range.max + dx; x = Utility.round(x + dx, 10)) {
            try {
                let cartesianPoint = {
                    x,
                    y: code.evaluate({ x })
                }
                points.push({
                    canvasPoint: this.mapToCanvasPoint(cartesianPoint),
                    cartesianPoint
                })
                index++
                const currentPoint = points[index].canvasPoint
                if (index > 0 && !isNaN(points[index - 1].cartesianPoint.y.toString())) {
                    const previousPoint = points[index - 1].canvasPoint
                    this.ctx.beginPath()
                    this.ctx.lineWidth = 2
                    this.ctx.moveTo(previousPoint.x, previousPoint.y)
                    this.ctx.lineTo(currentPoint.x, currentPoint.y)
                    this.ctx.stroke()
                }
            } catch (error) {
                points.push({ canvasPoint: null, cartesianPoint: null })
                console.error(error)
            }
        }
    }

    mapToCanvasPoint(cartesianPoint) {
        const x_unit = this.width / (this.x_range.max - this.x_range.min)
        const y_unit = this.height / (this.y_range.max - this.y_range.min)
        return {
            x: this.width / 2 + cartesianPoint.x * x_unit,
            y: this.height / 2 - cartesianPoint.y * y_unit
        }
    }

    updateAxisMarkers() {
        this.posXMarker.innerText = this.x_range.max
        this.negXMarker.innerText = this.x_range.min
        this.posYMarker.innerText = this.y_range.max
        this.negYMarker.innerText = this.y_range.min 
    }

    graphSlopeField(expression) {
        let code
        try {
            const node = math.parse(expression)
            code = node.compile()
            console.log("code", node, code, code.evaluate({ x: 1, y: 1 }))
        } catch (error) {
            console.log(error)
            return
        }
        let points = []
        const x_step = (this.x_range.max - this.x_range.min) / this.slope_intervals.x
        const y_step = (this.y_range.max - this.y_range.min) / this.slope_intervals.y
        let index = -1
        for (let x = this.x_range.min; x <= this.x_range.max + x_step; x += x_step) {
            for (let y = this.y_range.min; y < this.y_range.max + y_step; y += y_step)
                try {
                    const cartesianPoint = { x, y }
                    const canvasPoint = this.mapToCanvasPoint(cartesianPoint)
                    const slope = code.evaluate({ x, y })
                    points.push({
                        cartesianPoint,
                        canvasPoint,
                        slope
                    })
                    this.drawSlopeFieldLine(canvasPoint, slope)
                } catch (error) {
                    console.error(error)
                }
 
        }
        console.log(points)
    }

    drawSlopeFieldLine(point, slope) {
        let hypotenuse = Math.abs(slope)
        hypotenuse = hypotenuse < 10 ? hypotenuse : 10
        hypotenuse = hypotenuse > 3 ? hypotenuse : 5
        const angle = Math.atan(slope)
        const dx = Math.cos(angle) * hypotenuse
        const dy = Math.sin(angle) * hypotenuse
        this.ctx.beginPath()
        this.ctx.lineWidth = 1
        this.ctx.moveTo(point.x - dx, point.y + dy)
        this.ctx.lineTo(point.x + dx, point.y - dy)
        this.ctx.stroke()
    }

    graphVectorField(expression) {
        let vector_expression
        try {
            expression = expression.split(",").map(e => e.trim())
            vector_expression = {
                x: expression[0].substring(1),
                y: expression[1].substring(0, expression[1].length - 1)
            }
        } catch (error) {
            return "Invalid input"
        }
        let code
        try {
            const node = {
                x: math.parse(vector_expression.x),
                y: math.parse(vector_expression.y)
            }
            code = {
                x: node.x.compile(),
                y: node.y.compile()
            }
            console.log("code", node, code, code.x.evaluate({ x: 1, y: 1 }), code.y.evaluate({ x: 1, y: 1 }))
        } catch (error) {
            console.log(error)
            return
        }
        let points = []
        const x_step = (this.x_range.max - this.x_range.min) / this.vector_intervals.x
        const y_step = (this.y_range.max - this.y_range.min) / this.vector_intervals.y
        let index = -1
        for (let x = this.x_range.min; x <= this.x_range.max + x_step; x += x_step) {
            for (let y = this.y_range.min; y < this.y_range.max + y_step; y += y_step)
                try {
                    const cartesianPoint = { x, y }
                    const canvasPoint = this.mapToCanvasPoint(cartesianPoint)
                    const vector = {
                        x: code.x.evaluate({ x, y }),
                        y: code.y.evaluate({ x, y })
                    }
                    points.push({
                        cartesianPoint,
                        canvasPoint,
                        vector
                    })
                    this.drawVector(canvasPoint, vector)
                } catch (error) {
                    console.error(error)
                }
 
        }
        console.log(points)
    }

    drawVector(point, vector) {
        const slope = vector.y / vector.x
        let hypotenuse = Math.sqrt(vector.x**2 + vector.y**2)
        hypotenuse = hypotenuse < 10 ? hypotenuse : 10
        const angle = Math.atan(slope)
        const dx = Math.cos(angle) * hypotenuse
        const dy = Math.sin(angle) * hypotenuse
        this.ctx.beginPath()
        this.ctx.lineWidth = 1
        this.ctx.moveTo(point.x - dx, point.y + dy)
        this.ctx.lineTo(point.x + dx, point.y - dy)
        this.ctx.stroke()
        if (vector.x > 0) {
            this.drawVectorTriangle({ x: point.x + dx, y: point.y - dy }, vector)
        } else {
            this.drawVectorTriangle({ x: point.x - dx, y: point.y + dy }, vector)
        }
    }

    drawVectorTriangle(point, vector) {
        this.ctx.strokeStyle = "black"
        this.ctx.fillStyle = "black"
        const angle = Math.atan(vector.y / vector.x)
        const side = 5
        this.ctx.beginPath()
        this.ctx.moveTo(point.x, point.y)
        this.ctx.lineTo(point.x - side/2 * Math.sin(angle), point.y - (side/2 * Math.cos(angle)))
        this.ctx.lineTo(point.x + side*Math.sqrt(3)/2 * Math.cos(angle) * Math.sign(vector.x), point.y - (side*Math.sqrt(3)/2 * Math.sin(angle)) * Math.sign(vector.x))
        this.ctx.lineTo(point.x + side/2 * Math.sin(angle), point.y + (side/2 * Math.cos(angle)))
        this.ctx.fill()
    }

    setInput(input) {
        this.input.value = input
        this.expressions = this.input.value.split(";").map(e => e.trim()).filter(e => e.length)
        this.drawGraphs()
    }

    setRange(range, value) {
        if (range === "x_range") {
            this.x_range = value
        } else if (range === "y_range") {
            this.y_range = value
        } else {
            return "No range found"
        }
        this.updateAxisMarkers()
        this.drawGraphs()
    }

    graphPolar(expression, options = {}) {
        console.log("POLAR")
        let code
        try {
            const node = math.parse(expression)
            code = node.compile()
            console.log("code", node, code, code.evaluate({ t: 1 }))
        } catch (error) {
            console.log(error)
            return
        }
        let points = []
        const range = options.range || this.polar_range
        const d_angle = (range.max - range.min) / this.polar_intervals
        let index = -1
        this.ctx.fillStyle = options.color || "black"
        this.ctx.strokeStyle = options.color || "black"
        for (let angle = range.min; angle <= range.max; angle = Utility.round(angle + d_angle, 10)) {
            try {
                let polarPoint = {
                    angle,
                    radius: code.evaluate({ t: angle })
                }
                const cartesianPoint = {
                    x: polarPoint.radius * Math.cos(angle),
                    y: polarPoint.radius * Math.sin(angle)
                }
                console.log(polarPoint, cartesianPoint)
                points.push({
                    canvasPoint: this.mapToCanvasPoint(cartesianPoint),
                    cartesianPoint
                })
                index++
                const currentPoint = points[index].canvasPoint
                if (index > 0 && !isNaN(points[index - 1].cartesianPoint.y.toString())) {
                    const previousPoint = points[index - 1].canvasPoint
                    this.ctx.beginPath()
                    this.ctx.lineWidth = 2
                    this.ctx.moveTo(previousPoint.x, previousPoint.y)
                    this.ctx.lineTo(currentPoint.x, currentPoint.y)
                    this.ctx.stroke()
                }
            } catch (error) {
                points.push({ canvasPoint: null, cartesianPoint: null })
                console.error(error)
            }
        }
    }

    parseRange(e) {
        console.log("min", e.substring(e.indexOf("[") + 1, e.indexOf(",")))
        console.log("max", e.substring(e.indexOf(",") + 1, e.indexOf("]")))
        if (e.includes("[")) {
            const minString = e.substring(e.indexOf("[") + 1, e.indexOf(","))
            const maxString = e.substring(e.indexOf(",") + 1, e.indexOf("]"))
            let min
            let max
            try {
                min = math.parse(minString).compile().evaluate()
                max = math.parse(maxString).compile().evaluate()
            } catch (error) {
                console.log(error)
            }
            return { min, max }
        }
    }

    graphParametric(expressions, options = {}) {
        console.log("PARAMETRIC")
        let x_function
        let y_function
        try {
            x_function = math.parse(expressions.x).compile()
            y_function = math.parse(expressions.y).compile()
            console.log(x_function.evaluate({ t: 1 }), y_function.evaluate({ t: 1 }))
        } catch (error) {
            console.log(error)
            return
        }
        let points = []
        const range = options.range || this.parametric_range
        const dt = (range.max - range.min) / this.polar_intervals
        let index = 0
        this.ctx.fillStyle = options.color || "black"
        this.ctx.strokeStyle = options.color || "black"
        for (let t = range.min; t <= range.max; t = Utility.round(t + dt, 10)) {
            try {
                const cartesianPoint = {
                    x: x_function.evaluate({ t }),
                    y: y_function.evaluate({ t })
                }
                points.push({
                    canvasPoint: this.mapToCanvasPoint(cartesianPoint),
                    cartesianPoint
                })
                const currentPoint = points[index].canvasPoint
                if (index > 0 && !isNaN(points[index - 1].cartesianPoint.y.toString())) {
                    const previousPoint = points[index - 1].canvasPoint
                    this.ctx.beginPath()
                    this.ctx.lineWidth = 2
                    this.ctx.moveTo(previousPoint.x, previousPoint.y)
                    this.ctx.lineTo(currentPoint.x, currentPoint.y)
                    this.ctx.stroke()
                }
                index++
            } catch (error) {
                points.push({ canvasPoint: null, cartesianPoint: null })
                console.error(error)
            }
        }
    }
}

