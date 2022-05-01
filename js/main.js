document.addEventListener("DOMContentLoaded", () => {
    const graph_1 = new Grapher({
        parent: document.getElementById("graph-1"),
        height: 600,
        width: 800
    })
    graph_1.setInput("p: x = sin(t), y = cos(t) [0, 1]")
})