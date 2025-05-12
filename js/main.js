document.addEventListener("DOMContentLoaded", () => {
    calculator = new Calculator()

    const graph = new Grapher({
        parent: document.getElementById("graph-1"),
        height: 0.75 * window.innerHeight,
        width: window.innerHeight
    })
    graph.setInput("sin(x)")
})