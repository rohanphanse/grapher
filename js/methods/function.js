function graphFunction(expression, canvas, x_range, y_range, intervals, options = {}) {
    // Create f(x) function with math.js
    let x_function
    try {
        x_function = math.parse(expression).compile()
        void x_function.evaluate({ x: 1 })
    } catch (error) {
        console.log(error)
        return
    }
    // Point data
    let points = []
    const dx = (x_range.max - x_range.min) / intervals
    let index = 0
    // Graph color
    const ctx = canvas.getContext("2d")
    ctx.strokeStyle = options.color || "black"
    // Loop through all x values
    for (let x = x_range.min; x <= x_range.max + dx; x = round(x + dx, 10)) {
        try {
            let cartesianPoint = {
                x,
                y: x_function.evaluate({ x })
            }
            // Map cartesian point to location on canvas
            points.push({
                canvasPoint: mapToCanvasPoint(canvas, x_range, y_range, cartesianPoint),
                cartesianPoint
            })
            const currentPoint = points[index].canvasPoint
            // Check for a previous point
            if (index > 0 && isFinite(points[index - 1].cartesianPoint.y.toString())) {
                const previousPoint = points[index - 1].canvasPoint
                // Draw line from previous to current point
                ctx.beginPath()
                ctx.lineWidth = 2
                ctx.moveTo(previousPoint.x, previousPoint.y)
                ctx.lineTo(currentPoint.x, currentPoint.y)
                ctx.stroke()
            }
            index++
        } catch (error) {
            points.push({ canvasPoint: null, cartesianPoint: null })
            console.error(error)
        }
    }
}