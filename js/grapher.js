class Grapher {
    constructor (params = {}) {
        // Parent element
        this.parent = params.parent
        this.height = params.height 
        this.width = params.width
        // State
        this.canZoom = true
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
        const dpr = window.devicePixelRatio || 1
        this.canvas.width = this.width * dpr
        this.canvas.height = this.height * dpr
        this.ctx.scale(dpr, dpr)
        // Graph properties
        this.box_size = 10
        this.x_range = { min: -10, max: 10 }
        this.y_range = { min: -7.5, max: 7.5 }
        this.function_intervals = 200
        this.field_intervals = 20
        this.slope_intervals = { x: this.width / this.field_intervals, y: this.height / this.field_intervals }
        this.vector_intervals = { x: this.width / this.field_intervals, y: this.height / this.field_intervals }
        this.polar_range = { min: 0, max: 2 * Math.PI }
        this.polar_intervals = 500
        this.parametric_range = { min: -10, max: 10 }
        this.parametric_intervals = 1000
        this.colors = ["red", "green", "blue", "purple", "black"]
        this.calc_options = { no_fraction: true, no_base_number: true, noAns: true, noRound: true }
        // Expressions
        this.expressions = []
        // Listeners
        this.addListeners()
        // Draw graphs
        this.updateAxisMarkers()
        this.drawGraphs()
        this.enablePan()
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
        input.placeholder = ""
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
        canvas.style.width = this.width + "px"
        canvas.style.height = this.height + "px"
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
            if (!this.canZoom) {
                return;
            }
            // Animate
            const original_x_range = { ...this.x_range }
            const original_y_range = { ...this.y_range }
            let frame = 1
            let total_frames = 10
            this.canZoom = false
            const interval = setInterval(() => {
                if (frame > total_frames) {
                    this.updateAxisMarkers()
                    this.canZoom = true
                    clearInterval(interval)
                    return
                }
                this.x_range = { min: original_x_range.min * (1 + frame / total_frames), max: original_x_range.max * (1 + frame / total_frames) }
                this.y_range = { min: original_y_range.min * (1 + frame / total_frames), max: original_y_range.max * (1 + frame / total_frames) }
                this.drawGraphs()
                frame++
            }, 10)
        }]
        this.zoomInButtonListener = ["click", () => {
            if (!this.canZoom) {
                return;
            }
            const original_x_range = { ...this.x_range }
            const original_y_range = { ...this.y_range }
            let frame = 1
            let total_frames = 10
            this.canZoom = false
            const interval = setInterval(() => {
                if (frame > total_frames) {
                    this.updateAxisMarkers()
                    this.canZoom = true
                    clearInterval(interval)
                    return
                }
                this.x_range = { min: original_x_range.min * (1 - 0.5 * frame / total_frames), max: original_x_range.max * (1 - 0.5 * frame / total_frames) }
                this.y_range = { min: original_y_range.min * (1 - 0.5 * frame / total_frames), max: original_y_range.max * (1 - 0.5 * frame / total_frames) }
                this.drawGraphs()
                frame++
            }, 10)
        }]
        this.inputListener = ["input", () => {
            this.expressions = this.input.value.split(";").map(e => e.trim()).filter(e => e.length)
            this.drawGraphs()
            if (this.input.value === "") {
                this.x_range = { min: -10, max: 10 }
                this.y_range = { min: -10, max: 10 }
                this.drawGraphs()
                this.updateAxisMarkers()
            }
        }]
        this.keyListener = ["keydown", (event) => {
            if (event.path && event.path[0] === document.body) {
                if (event.keyCode === 187) {
                    this.zoomInButton.click()
                } else if (event.keyCode === 189) {
                    this.zoomOutButton.click()
                } else if (event.keyCode === 39) {
                    const delta_x = this.x_range.max - this.x_range.min
                    const delta_y = this.y_range.max - this.y_range.min
                    this.x_range = {
                        min: this.x_range.min + delta_x / 10,
                        max: this.x_range.min + delta_x / 10
                    }
                    this.drawGraphs()
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
        const origin = this.mapToCanvasPoint({ x: 0, y: 0 })
        const x_offset = (origin.x) % this.box_size
        const y_offset = (origin.y) % this.box_size
        this.ctx.lineWidth = 0.5
        const color = getComputedStyle(document.body).getPropertyValue("--border")
        // Vertical lines
        for(let i = 0; i < this.width / this.box_size; i++) {
            this.ctx.strokeStyle = color
            this.ctx.beginPath()
            this.ctx.moveTo(i * this.box_size + 0.5 + x_offset, 0)
            this.ctx.lineTo(i * this.box_size + 0.5 + x_offset, this.height)
            this.ctx.stroke()
        }
        // Horizontal lines
        for (let i = 0; i < this.height / this.box_size; i++) {
            this.ctx.beginPath()
            this.ctx.moveTo(0, i * this.box_size + 0.5 + y_offset)
            this.ctx.lineTo(this.width, i * this.box_size + 0.5 + y_offset)
            this.ctx.stroke()
        }       
        const axis_color = getComputedStyle(document.body).getPropertyValue("--text")
        this.ctx.strokeStyle = axis_color
        // Center vertical line 
        this.ctx.beginPath()
        this.ctx.moveTo(origin.x + 0.5, 0)
        this.ctx.lineTo(origin.x + 0.5, this.height)
        this.ctx.stroke()
        // Center horizontal line
        this.ctx.beginPath()
        this.ctx.moveTo(0, origin.y + 0.5)
        this.ctx.lineTo(this.width, origin.y + 0.5)
        this.ctx.stroke()
    }

    drawGraphs() {
        try {
            this.ctx.clearRect(0, 0, this.width, this.height)
            this.drawGraphLines()
            // console.log(this.expressions)
            for (let i = 0; i < this.expressions.length; i++) {
                const split_equals = this.expressions[i].split("=").map(e => e.trim())
                if (this.expressions[i].substring(0, 2) === "s:") {
                    const options = {}
                    options.color = this.colors[i % this.colors.length]
                    this.graphSlopeField(this.expressions[i].substring(2), options)
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
                        options.range = this.parseRange(split_comma[1] + "," + split_comma[2])
                        expressions.y = split_comma[1].split("=")[1].split("[")[0]
                    }
                    this.graphParametric(expressions, options)
                } else if (split_equals.length === 2 && split_equals[0] === "r") {
                    let options = {}
                    options.color = this.colors[i % this.colors.length]
                    let expression = split_equals[1]
                    if (split_equals[1].includes("[")) {
                        options.range = this.parseRange(split_equals[1])
                        expression = split_equals[1].substring(0, split_equals[1].indexOf("["))
                    }
                    this.graphPolar(expression, options)
                } else {
                    const options = {}
                    options.color = this.colors[i % this.colors.length]
                    this.graphFunction(this.expressions[i], options)
                }
            }
        } catch (error) {
            // console.log(error)
        }
    }

    mapToCanvasPoint(cartesianPoint) {
        const x_unit = this.width / (this.x_range.max - this.x_range.min)
        const y_unit = this.height / (this.y_range.max - this.y_range.min)
        return {
            x: (cartesianPoint.x - this.x_range.min) * x_unit,
            y: this.height - (cartesianPoint.y - this.y_range.min) * y_unit
        }
    }

    updateAxisMarkers() {
        this.posXMarker.innerText = parseFloat(round(this.x_range.max, 1)).toString()
        this.negXMarker.innerText = parseFloat(round(this.x_range.min, 1)).toString()
        this.posYMarker.innerText = parseFloat(round(this.y_range.max, 1)).toString()
        this.negYMarker.innerText = parseFloat(round(this.y_range.min, 1)).toString()
        const origin = this.mapToCanvasPoint({ x: 0, y: 0 })
        const canvas_bounds = {
            left: 0,
            top: 0,
            right: this.width - 40,
            bottom: this.height - 15
        }
        let posX = origin.y + 5
        let negX = origin.y + 5
        let posY = origin.x + 5
        let negY = origin.x + 5
        // Bound markers within canvas
        posX = Math.max(canvas_bounds.top + 5, Math.min(posX, canvas_bounds.bottom))
        negX = Math.max(canvas_bounds.top + 5, Math.min(negX, canvas_bounds.bottom))
        posY = Math.max(canvas_bounds.left + 5, Math.min(posY, canvas_bounds.right))
        negY = Math.max(canvas_bounds.left + 5, Math.min(negY, canvas_bounds.right))
        this.posXMarker.style.top = `${posX}px`
        this.negXMarker.style.top = `${negX}px`
        this.posYMarker.style.left = `${posY}px`
        this.negYMarker.style.left = `${negY}px`
    }

    graphSlopeField(expression, options) {
        try {
            delete calculator.functions["graph"]
            if (expression in calculator.functions) {
                calculator.calculate(`graph(x, y) = ${expression}(x, y)`, this.calc_options)
            } else {
                calculator.calculate(`graph(x, y) = ${expression}`, this.calc_options)
            }
            let result = calculator.calculate("graph(1, 1)", this.calc_options)
            if (typeof result !== "number" && !(typeof result === "string" && result.includes("NaN"))) {
                throw result
            }
        } catch (error) {
            // console.log("Error", error)
            return
        }
        let points = []
        this.ctx.strokeStyle = options.color || "black"
        const x_step = (this.x_range.max - this.x_range.min) / this.slope_intervals.x
        const y_step = (this.y_range.max - this.y_range.min) / this.slope_intervals.y
        for (let x = this.x_range.min; x <= this.x_range.max + x_step; x += x_step) {
            for (let y = this.y_range.min; y < this.y_range.max + y_step; y += y_step)
                try {
                    const cartesianPoint = { x, y }
                    const canvasPoint = this.mapToCanvasPoint(cartesianPoint)
                    const slope = calculator.evaluate(["graph", new Paren([x, y])], this.calc_options)
                    points.push({
                        cartesianPoint,
                        canvasPoint,
                        slope
                    })
                    this.drawSlopeFieldLine(canvasPoint, slope)
                } catch (error) {
                    // console.error(error)
                }
 
        }
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
        try {
            expression = expression.split(",").map(e => e.trim())
            expression = {
                x: expression[0].substring(1),
                y: expression[1].substring(0, expression[1].length - 1)
            }
        } catch (error) {
            return "Invalid input"
        }
        try {
            delete calculator.functions["graphx"]
            delete calculator.functions["graphy"]
            if (expression.x in calculator.functions) {
                calculator.calculate(`graphx(x, y) = ${expression.x}(x, y)`, this.calc_options)
            } else {
                calculator.calculate(`graphx(x, y) = ${expression.x}`, this.calc_options)
            }
            if (expression.y in calculator.functions) {
                calculator.calculate(`graphy(x, y) = ${expression.y}(x, y)`, this.calc_options)
            } else {
                calculator.calculate(`graphy(x, y) = ${expression.y}`, this.calc_options)
            }
            let result = calculator.calculate("graphx(1, 1)", this.calc_options)
            if (typeof result !== "number" && !(typeof result === "string" && result.includes("NaN"))) {
                throw result
            }
            result = calculator.calculate("graphy(1, 1)", this.calc_options)
            if (typeof result !== "number" && !(typeof result === "string" && result.includes("NaN"))) {
                throw result
            }
        } catch (error) {
            // console.log("Error", error)
            return
        }
        let points = []
        const x_step = (this.x_range.max - this.x_range.min) / this.vector_intervals.x
        const y_step = (this.y_range.max - this.y_range.min) / this.vector_intervals.y
        for (let x = this.x_range.min; x <= this.x_range.max + x_step; x += x_step) {
            for (let y = this.y_range.min; y < this.y_range.max + y_step; y += y_step)
                try {
                    const cartesianPoint = { x, y }
                    const canvasPoint = this.mapToCanvasPoint(cartesianPoint)
                    const vector = {
                        x: calculator.evaluate(["graphx", new Paren([x, y])], this.calc_options),
                        y: calculator.evaluate(["graphy", new Paren([x, y])], this.calc_options)
                    }
                    points.push({
                        cartesianPoint,
                        canvasPoint,
                        vector
                    })
                    this.drawVector(canvasPoint, vector)
                } catch (error) {
                    // console.error(error)
                }
 
        }
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
        if (is_close(vector.x, 0) && is_close(vector.y, 0)) {
            return
        } else if (is_close(vector.x, 0)) {
            vector.x = 1e-9
            hypotenuse = Math.min(10, Math.abs(vector.y))
            if (vector.y > 0) {
                this.drawVectorTriangle({ x: point.x, y: point.y - hypotenuse }, vector)
            } else {
                this.drawVectorTriangle({ x: point.x, y: point.y + hypotenuse }, vector)
            }
        } else if (vector.x > 0) {
            this.drawVectorTriangle({ x: point.x + dx, y: point.y - dy }, vector)
        } else if (vector.x < 0) {
            this.drawVectorTriangle({ x: point.x - dx, y: point.y + dy }, vector)
        }
    }

    drawVectorTriangle(point, vector) {
        const color = getComputedStyle(document.body).getPropertyValue("--text")
        this.ctx.strokeStyle = color
        this.ctx.fillStyle = color
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
        try {
            delete calculator.functions["graph"]
            if (expression in calculator.functions) {
                calculator.calculate(`graph(t) = ${expression}(t)`, this.calc_options)
            } else {
                calculator.calculate(`graph(t) = ${expression}`, this.calc_options)
            }
            let result = calculator.calculate("graph(1)", this.calc_options)
            if (typeof result !== "number" && !(typeof result === "string" && result.includes("NaN"))) {
                throw result
            }
        } catch (error) {
            // console.log("Error", error)
            return
        }
        let points = []
        const range = options.range || this.polar_range
        const d_angle = (range.max - range.min) / this.polar_intervals
        let index = -1
        this.ctx.fillStyle = options.color || "black"
        this.ctx.strokeStyle = options.color || "black"
        for (let angle = range.min; angle <= range.max; angle = round(angle + d_angle, 10)) {
            try {
                let polarPoint = {
                    angle,
                    radius: calculator.evaluate(["graph", new Paren([angle])], this.options)
                }
                const cartesianPoint = {
                    x: polarPoint.radius * Math.cos(angle),
                    y: polarPoint.radius * Math.sin(angle)
                }
                // console.log(polarPoint, cartesianPoint)
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
                // console.error(error)
            }
        }
    }

    parseRange(e) {
        if (e.includes("[")) {
            const minString = e.substring(e.indexOf("[") + 1, e.indexOf(","))
            const maxString = e.substring(e.indexOf(",") + 1, e.indexOf("]"))
            let min
            let max
            try {
                min = calculator.calculate(minString, this.calc_options)
                max = calculator.calculate(maxString, this.calc_options)
                if (typeof min !== "number" || typeof max !== "number") {
                    throw [min, max]
                }
            } catch (error) {
                // console.log(error)
                return
            }
            if (min === max) {
                throw new Error("Invalid range!")
            } 
            return { min, max }
        }
    }

    graphParametric(expressions, options = {}) {
        try {
            delete calculator.functions["graphx"]
            delete calculator.functions["graphy"]
            if (expressions.x in calculator.functions) {
                calculator.calculate(`graphx(t) = ${expressions.x}(t)`, this.calc_options)
            } else {
                calculator.calculate(`graphx(t) = ${expressions.x}`, this.calc_options)
            }
            if (expressions.y in calculator.functions) {
                calculator.calculate(`graphy(t) = ${expressions.y}(t)`, this.calc_options)
            } else {
                calculator.calculate(`graphy(t) = ${expressions.y}`, this.calc_options)
            }
            let result = calculator.calculate("graphx(1)", this.calc_options)
            if (typeof result !== "number" && !(typeof result === "string" && result.includes("NaN"))) {
                throw result
            }
            result = calculator.calculate("graphy(1)", this.calc_options)
            if (typeof result !== "number" && !(typeof result === "string" && result.includes("NaN"))) {
                throw result
            }
        } catch (error) {
            // console.log("Error", error)
            return
        }
        let points = []
        const range = options.range || this.parametric_range
        const dt = (range.max - range.min) / this.parametric_intervals
        let index = 0
        this.ctx.fillStyle = options.color || "black"
        this.ctx.strokeStyle = options.color || "black"
        for (let t = range.min; t <= range.max; t = round(t + dt, 10)) {
            try {
                const cartesianPoint = {
                    x: calculator.evaluate(["graphx", new Paren([t])], this.calc_options),
                    y: calculator.evaluate(["graphy", new Paren([t])], this.calc_options)
                }
                points.push({
                    canvasPoint: this.mapToCanvasPoint(cartesianPoint),
                    cartesianPoint
                })
                const currentPoint = points[index].canvasPoint
                if (index > 0 && isFinite(points[index - 1].cartesianPoint.y.toString())) {
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
                // console.error(error)
            }
        }
    }

    enablePan() {
        let pos = { x: 0, y: 0 }
        let dragging = false
        function handleMouseDown(event) {
            dragging = false
            pos = { x: event.clientX, y: event.clientY }
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }
        const handleMouseMove = (event) => {
            const dx = event.clientX - pos.x
            const dy = event.clientY - pos.y
            pos = { x: event.clientX, y: event.clientY }
            const x_range = this.x_range.max - this.x_range.min
            const y_range = this.y_range.max - this.y_range.min
            const delta_x = -dx * x_range / this.width
            const delta_y = dy * y_range / this.height
            this.x_range.min += delta_x
            this.x_range.max += delta_x
            this.y_range.min += delta_y
            this.y_range.max += delta_y
            dragging = true
            this.drawGraphs()
            this.updateAxisMarkers()
        }
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
        this.canvas.addEventListener("mousedown", handleMouseDown)
    }

    graphFunction(expression, options = {}) {
        try {
            delete calculator.functions["graph"]
            if (expression in calculator.functions) {
                calculator.calculate(`graph(x) = ${expression}(x)`, this.calc_options)
            } else {
                calculator.calculate(`graph(x) = ${expression}`, this.calc_options)
            }
            let result = calculator.calculate("graph(1)", this.calc_options)
            if (typeof result !== "number" && !(typeof result === "string" && result.includes("NaN"))) {
                throw result
            }
        } catch (error) {
            // console.log(error) 
            return
        }
        // Point data
        let points = []
        const dx = (this.x_range.max - this.x_range.min) / this.function_intervals
        let index = 0
        // Graph color
        this.ctx.strokeStyle = options.color || "black"
        let x = this.x_range.min
        let min_step = dx / 10
        let skip = false
        let discont = false
        while (x <= this.x_range.max + dx) {
            let step = dx
            try {
                let cartesianPoint = {
                    x,
                    y: calculator.evaluate(["graph", new Paren([x])], this.calc_options)
                }
                if (isNaN(cartesianPoint.y)) {
                    x += step
                    discont = true
                    continue
                }
                points.push({
                    canvasPoint: this.mapToCanvasPoint(cartesianPoint),
                    cartesianPoint
                })
                if (discont) {
                    x += step
                    index++
                    discont = false
                    continue
                }
                const currentPoint = points[index].canvasPoint
                const currentCartesian = points[index].cartesianPoint
                // Check for a previous point
                if (index > 0 && (isFinite(points[index - 1].cartesianPoint.y.toString()))) {
                    const previousPoint = points[index - 1].canvasPoint
                    const previousCartesian = points[index - 1].cartesianPoint
                    const slope = (currentCartesian.y - previousCartesian.y) / (currentCartesian.x - previousCartesian.x)
                    step =  Math.min(Math.max(min_step, dx / (1 + Math.abs(slope))), dx)
                    // Draw line from previous to current point
                    if (Math.abs(slope) < 10000) {
                        if (skip) {
                            skip = false
                        } else {
                            this.ctx.beginPath()
                            this.ctx.lineWidth = 2
                            this.ctx.moveTo(previousPoint.x, previousPoint.y)
                            this.ctx.lineTo(currentPoint.x, currentPoint.y)
                            this.ctx.stroke()
                        }
                    } else {
                        skip = true
                    }
                }
                x += step
                index++
                // console.log(cartesianPoint.x, cartesianPoint.y)
            } catch (error) {
                points.push({ canvasPoint: null, cartesianPoint: null })
                // console.error(error)
                x += step
            }
        }
    }
}