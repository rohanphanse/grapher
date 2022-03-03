document.addEventListener("DOMContentLoaded", () => {
    const graph_1 = new Grapher({
        parent: document.getElementById("graph-1"),
        height: 600,
        width: 800
    })
    graph_1.setInput("cos(x)/x")
    // graph_1.setRange("x_range", { min: -10, max: 10 })
    // graph_1.setRange("y_range", { min: -7.5, max: 7.5 })
    // const graph_2 = new Grapher({
    //     parent: document.getElementById("graph-2"),
    //     height: 400,
    //     width: 400
    // })
    // const graph_3 = new Grapher({
    //     parent: document.getElementById("graph-3"),
    //     height: 400,
    //     width: 400
    // })
})