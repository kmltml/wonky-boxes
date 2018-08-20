document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("#main-canvas")
    const ctxt = canvas.getContext("2d")

    let center = { x: 200, y: 200, update() { updateWH(); updateWD(); updateDH(); } }
    let width = { x: 340, y: 260, update() { updateWH(); updateWD(); } }
    let height = { x: 200, y: 60, update() { updateWH(); updateDH(); } }
    let depth = { x: 60, y: 260, update() { updateDH(); updateWD(); } }
    let wh = { x: 320, y: 140, update() { updateDH(); updateWD(); } }
    let dh = { x: 80, y: 140, update() { updateWH(); updateWD(); } }
    let wd = { x: 200, y: 300, update() { updateWH(); updateDH(); } }

    let points = [center, width, height, depth, wh, dh, wd]

    let grabbed = null

    function redraw() {
        ctxt.clearRect(0, 0, canvas.width, canvas.height)
        ctxt.beginPath()
        points.forEach(p => {
            ctxt.moveTo(p.x + 2, p.y)
            ctxt.ellipse(p.x, p.y, 2, 2, 0, 0, 360)
        })
        ctxt.moveTo(width.x, width.y)
        ctxt.lineTo(center.x, center.y)
        ctxt.lineTo(height.x, height.y)
        ctxt.moveTo(center.x, center.y)
        ctxt.lineTo(depth.x, depth.y)
        ctxt.lineTo(dh.x, dh.y)
        ctxt.lineTo(height.x, height.y)
        ctxt.lineTo(wh.x, wh.y)
        ctxt.lineTo(width.x, width.y)
        ctxt.lineTo(wd.x, wd.y)
        ctxt.lineTo(depth.x, depth.y)


        ctxt.stroke()
    }

    function getCoords({x, y}) {
        const bounds = canvas.getBoundingClientRect()
        return { x: x - bounds.left, y: y - bounds.top }
    }

    function intersect(a1, a2, b1, b2) {
        const c = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x)
        if(Math.abs(c) < 0.01) return null;
        const a = a1.x * a2.y - a1.y * a2.x
        const b = b1.x * b2.y - b1.y * b2.x
        return {
            x: (a * (b1.x - b2.x) - b * (a1.x - a2.x)) / c,
            y: (a * (b1.y - b2.y) - b * (a1.y - a2.y)) / c
        }
    }

    function updateWH() {
        const widthVP = intersect(center, width, depth, wd)
        const heightVP = intersect(center, height, depth, dh)
        if(widthVP !== null && heightVP !== null) {
            const newpos = intersect(width, heightVP, height, widthVP)
            if(newpos !== null) {
                wh.x = newpos.x
                wh.y = newpos.y
            }
        }
    }

    function updateWD() {
        const widthVP = intersect(center, width, height, wh)
        const depthVP = intersect(center, depth, height, dh)
        if(widthVP !== null && depthVP !== null) {
            const newpos = intersect(width, depthVP, depth, widthVP)
            if(newpos !== null) {
                wd.x = newpos.x
                wd.y = newpos.y
            }
        }
    }

    function updateDH() {
        const depthVP = intersect(center, depth, width, wd)
        const heightVP = intersect(center, height, width, wh)
        if(depthVP !== null && heightVP !== null) {
            const newpos = intersect(height, depthVP, depth, heightVP)
            if(newpos !== null) {
                dh.x = newpos.x
                dh.y = newpos.y
            }
        }
    }

    canvas.addEventListener("mousedown", e => {
        let {x, y} = getCoords(e)
        let [nearesti, distsq] = points
            .map((p, i) => [i, (p.x - x) ** 2 + (p.y - y) ** 2])
            .reduce((([ai, a], [bi, b]) => a < b ? [ai, a] : [bi, b]), [0, points[0]])
        if(distsq <= 100) {
            grabbed = points[nearesti]
        } else {
            grabbed = null
            updateWH()
        }
    })

    canvas.addEventListener("mousemove", e => {
        if(grabbed !== null) {
            let {x, y} = getCoords(e)
            grabbed.x = x
            grabbed.y = y
            grabbed.update()
            redraw()
        }
    })

    canvas.addEventListener("mouseup", e => {
        grabbed = null
    })

    redraw()
})
