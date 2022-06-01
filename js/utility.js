function round(number, precision) {
    return Math.round(number * 10**precision) / 10**precision
}

function mapToCanvasPoint(canvas, x_range, y_range, cartesianPoint) {
    const x_unit = canvas.width / (x_range.max - x_range.min)
    const y_unit = canvas.height / (y_range.max - y_range.min)
    return {
        x: (cartesianPoint.x - x_range.min) * x_unit,
        y: -y_range.min * y_unit - cartesianPoint.y * y_unit
    }
}