function graphPolar(expression, canvas, angle_range, x_range, y_range, intervals, options = {}) {
        // Create r(t) function with math.js
        let r_function
        try {
            r_function = math.parse(expression).compile()
            void r_function.evaluate({ t: 1 })
        } catch (error) {
            console.log(error)
            return
        }
        // Points data
        let points = []
        const d_angle = (angle_range.max - angle_range.min) / intervals
        let index = 0
        // Graph color
        const ctx = canvas.getContext("2d")
        ctx.strokeStyle = options.color || "black"
        for (let angle = range.min; angle <= range.max; angle = round(angle + d_angle, 10)) {
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