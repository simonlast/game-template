import React, { Component } from "react"
import "./App.css"
import p5 from "p5"
import sketch from "./sketch"

interface AppProps {}

interface AppState {}

class App extends Component<AppProps, AppState> {
	private wrapper: HTMLDivElement | null = null
	private canvas: p5 | undefined

	constructor(initialState: AppState) {
		super(initialState)
		this.state = {}
	}

	componentDidMount() {
		if (this.wrapper) {
			this.canvas = new p5(sketch, this.wrapper)
		}
	}

	render() {
		return <div className="App" ref={wrapper => (this.wrapper = wrapper)}></div>
	}
}

export default App
