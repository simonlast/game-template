import p5 from "p5"

export default function(p: p5) {
	p.setup = function() {
		p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
		p.smooth()
	}

	p.draw = function() {
		p.fill(255)
		p.ellipse(p.mouseX - p.width / 2, p.mouseY - p.height / 2, 80, 80)
	}
}
