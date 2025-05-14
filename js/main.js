document.addEventListener("DOMContentLoaded", () => {
    calculator = new Calculator()
    const length = Math.min(window.innerHeight, window.innerWidth)
    const graph = new Grapher({
        parent: document.getElementById("graph-1"),
        height: 0.75 * 0.9 * length,
        width: 0.9 * length
    })
    graph.setInput("sin(x)")

    window.addEventListener("resize", () => {
        const length = Math.min(window.innerHeight, window.innerWidth)
        graph.updateSize({
            height: 0.75 * 0.9 * length,
            width: 0.9 * length
        })
    })
})