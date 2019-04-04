class SceneEditor extends GuaScene {
	constructor(game) {
		super(game)
		//bg
		let bg = GuaImage.new(game, 'bg')
		this.addElement(bg)
		//循环移动的地图
		this.ground = []
		for (let i = 0; i < 30; i++) {
			let g = GuaImage.new(game, 'ground')
			g.x = i * 19
			g.y = 540
			this.addElement(g)
			this.ground.push(g)
		}
		this.skipCount=4
		//mario
		le

	}
}