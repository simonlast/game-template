import p5 from "p5"

export default function(p: p5) {
	const opacity = 120

	function randomColor() {
		return p.color(
			p.random(0, 255),
			p.random(0, 255),
			p.random(0, 255),
			opacity
		)
	}

	class Obj {
		step(dt: number): boolean {
			return true
		}
		render() {}
	}

	class Ray extends Obj {
		pos: p5.Vector
		animate: number
		color: p5.Color

		constructor(pos: p5.Vector, color: p5.Color) {
			super()
			this.pos = pos
			this.animate = 10
			this.color = color
		}

		step(dt: number) {
			this.animate += dt * 0.2

			if (this.animate > w * 1.5) {
				return false
			} else {
				return true
			}
		}

		render() {
			p.noStroke()
			p.fill(this.color)

			let total = 20
			const size = 30

			for (let i = 0; i < total; i++) {
				p.push()
				p.translate(this.pos.x, this.pos.y)
				p.rotate((i / total) * Math.PI * 2 + this.animate / 150)
				p.translate(0, -this.animate)
				p.triangle(
					0,
					-(this.animate / 6),
					-size / 3 - this.animate / 6,
					size,
					size / 3 + this.animate / 6,
					size
				)
				p.pop()
			}
		}
	}

	class GridLine extends Obj {
		pos: p5.Vector
		v: p5.Vector

		constructor(pos: p5.Vector, v: p5.Vector) {
			super()
			this.pos = pos
			this.v = v
		}

		step(dt: number) {
			if (this.pos.y > h) {
				this.v.rotate(Math.PI)
				this.pos.y = h
			}

			if (this.pos.y < 0) {
				this.v.rotate(Math.PI)
				this.pos.y = 0
			}

			if (this.pos.x > w) {
				this.v.rotate(Math.PI)
				this.pos.x = w
			}

			if (this.pos.x < 0) {
				this.v.rotate(Math.PI)
				this.pos.x = 0
			}

			this.pos.add(this.v)
			return true
		}

		render() {
			p.fill(0, 0, 0, opacity)
			p.noStroke()
			p.rect(this.pos.x, this.pos.y, gridSize, gridSize)
		}
	}

	class Wall extends Obj {
		pos: p5.Vector
		dim: p5.Vector
		animate: number

		constructor(pos: p5.Vector, dim: p5.Vector) {
			super()
			this.pos = pos
			this.dim = dim
			this.animate = 0
		}

		step(dt: number) {
			this.animate += dt * 0.001
			if (this.animate > 1) {
				this.animate = 0
			}
			return true
		}

		render() {
			p.fill(0, 0, 0, opacity)
			p.noStroke()
			const animateNormalized = this.animate * 2 - 1
			p.rect(
				this.pos.x + this.dim.x / 2 + (animateNormalized * this.dim.x) / 2,
				this.pos.y,
				wallSize,
				wallSize
			)
		}
	}

	class Player extends Obj {
		pos: p5.Vector
		v: p5.Vector
		color: p5.Color

		constructor(pos: p5.Vector) {
			super()
			this.pos = pos
			this.v = p.createVector()
			this.color = randomColor()
		}

		step(dt: number) {
			this.pos.add(p5.Vector.mult(this.v, dt))

			if (this.pos.x - playerSize / 2 < 0) {
				this.pos.x = w - playerSize / 2
			}
			if (this.pos.x + playerSize / 2 > w) {
				this.pos.x = playerSize / 2
			}
			if (this.pos.y - playerSize / 2 < 0) {
				this.pos.y = h - playerSize / 2
			}
			if (this.pos.y + playerSize / 2 > h) {
				this.pos.y = playerSize / 2
			}

			return true
		}

		render() {
			p.fill(this.color)
			p.noStroke()
			p.ellipse(this.pos.x, this.pos.y, playerSize, playerSize)
		}
	}

	/*

	*/

	const w = p.windowWidth
	const h = p.windowHeight
	let lastNow = Date.now()

	const playerSize = 40
	const wallSize = 40
	const playerSpeed = 0.5
	const gridSize = 10

	let rays: Array<Obj> = []
	const grid: Array<Obj> = []
	let walls: Array<Obj> = []
	const player = new Player(p.createVector(w / 2, h / 2))

	const horizontalLines = 20
	for (let i = 0; i < horizontalLines; i++) {
		const x = ((i + 0.5) / horizontalLines) * w
		grid.push(
			new GridLine(
				p.createVector(x, Math.random() * h),
				p.createVector(0, gridSize)
			)
		)
	}

	const verticalLines = 12
	for (let i = 0; i < verticalLines; i++) {
		const y = ((i + 0.5) / verticalLines) * h
		grid.push(
			new GridLine(
				p.createVector(Math.random() * w, y),
				p.createVector(-gridSize, 0)
			)
		)
	}

	walls.push(new Wall(p.createVector(100, 100), p.createVector(300, 30)))

	function shootRay() {
		const toColor = randomColor()
		const lerp = p.lerpColor(player.color, toColor, 0.5)
		player.color = lerp
		rays.push(new Ray(p.createVector(player.pos.x, player.pos.y), player.color))
	}

	p.setup = () => {
		p.colorMode("rgb")
		p.createCanvas(w, h, p.WEBGL)
		p.smooth()
		shootRay()
		p.background(randomColor())
	}

	p.mousePressed = () => {}

	p.keyPressed = () => {
		const newPlayerV = p.createVector()

		// Left
		if (p.keyIsDown(37)) {
			shootRay()
			newPlayerV.add(-playerSpeed, 0)
			player.v = newPlayerV
		}
		// Up
		else if (p.keyIsDown(38)) {
			shootRay()
			newPlayerV.add(0, -playerSpeed)
			player.v = newPlayerV
		}
		// Right
		else if (p.keyIsDown(39)) {
			shootRay()
			newPlayerV.add(playerSpeed, 0)
			player.v = newPlayerV
		}
		// Down
		else if (p.keyIsDown(40)) {
			shootRay()
			newPlayerV.add(0, playerSpeed)
			player.v = newPlayerV
		}
	}

	p.draw = () => {
		p.translate(-w / 2, -h / 2)
		// p.background(255)

		const now = Date.now()
		const dt = now - lastNow
		lastNow = now

		rays = rays.filter(obj => obj.step(dt))
		walls = walls.filter(obj => obj.step(dt))
		for (const obj of grid) {
			obj.step(dt)
		}
		player.step(dt)

		player.render()

		// for (const obj of walls) {
		// 	obj.render()
		// }
		for (const obj of grid) {
			obj.render()
		}
		for (const obj of rays) {
			obj.render()
		}
	}
}
