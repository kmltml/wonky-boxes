document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("#main-canvas")
    const ctxt = canvas.getContext("2d")

    const SelectorRadius = 10
    const SelectorWhisk = 2

    function Colinear() {
        const a = { x: Math.random() * canvas.width, y: Math.random() * canvas.height }
        const b = { x: Math.random() * canvas.width, y: Math.random() * canvas.height }
        return {
            points: [a, b],
            score(p) {
                const area = Math.abs((b.y - a.y) * p.x - (b.x - a.x) * p.y + b.x * a.y - b.y * a.x)
                const length = Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2)
                return (20 - (area / length)) * 5
            },
            drawHint() {
                ctxt.save()
                ctxt.strokeStyle = "#00cc00"
                ctxt.beginPath()
                ctxt.moveTo(a.x, a.y)
                ctxt.lineTo(b.x, b.y)
                ctxt.stroke()
                ctxt.restore()
            }
        }
    }

    let task = Colinear()

    function drawTask() {
        ctxt.beginPath()
        task.points.forEach(({x, y}) => {
            ctxt.moveTo(x, y)
            ctxt.ellipse(x, y, 1, 1, 0, 0, 360)
        })
        ctxt.stroke()
    }

    drawTask()

    function drawSelector() {
        const x = selector.x
        const y = selector.y
        ctxt.beginPath()

        ctxt.ellipse(x, y, 1, 1, 0, 0, 360)
        ctxt.moveTo(x + SelectorRadius, y)
        ctxt.ellipse(x, y, SelectorRadius, SelectorRadius, 0, 0, 360)

        ctxt.moveTo(x - SelectorRadius - SelectorWhisk, y)
        ctxt.lineTo(x - SelectorRadius + SelectorWhisk, y)

        ctxt.moveTo(x + SelectorRadius - SelectorWhisk, y)
        ctxt.lineTo(x + SelectorRadius + SelectorWhisk, y)

        ctxt.moveTo(x, y - SelectorRadius - SelectorWhisk)
        ctxt.lineTo(x, y - SelectorRadius + SelectorWhisk)

        ctxt.moveTo(x, y + SelectorRadius - SelectorWhisk)
        ctxt.lineTo(x, y + SelectorRadius + SelectorWhisk)

        ctxt.stroke()
    }

    let dragging = false
    let selector = {x: 0, y: 0}

    canvas.addEventListener("mousedown", e => {
        dragging = true
    })
    canvas.addEventListener("mousemove", e => {
        if(dragging) {
            ctxt.clearRect(0, 0, canvas.width, canvas.height)
            const bounds = canvas.getBoundingClientRect()
            selector.x = e.x - bounds.left
            selector.y = e.y - bounds.top
            drawSelector()
            drawTask()
        }
    })
    canvas.addEventListener("mouseup", e => {
        dragging = false
    })

    document.querySelector("#check-btn").addEventListener("click", e => {
        alert(`Your score is ${task.score(selector)}`)
        task.drawHint()
    })
    function newTask() {
        ctxt.clearRect(0, 0, canvas.width, canvas.height)
        task = Colinear()
        drawTask()
    }
    document.querySelector("#new-btn").addEventListener("click", newTask)

})
