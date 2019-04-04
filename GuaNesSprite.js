// var mario=new Mario()

// function Mario(){
// 	//基本属性

// 			上0
// 		左3    右1
// 			下2
	
// 	this.move=function(direction){
// 		var mymario=document.getElementById
// 	}
// }
class GuaNesSprite{
	constructor(game){
		this.game=game
		this.offset=32784
		this.data=window.bytes.slice(this.offset)
		this.animations={
			idle:[]
		}

		this.pixelWidth=10
		this.rowsOfSprite=4
		this.columsOfSprite=2
		this.w=this.pixelWidth*this.columsOfSprite*8
		this.h=this.pixelWidth*this.rowsOfSprite*8
		this.frameIndex=0
		this.frameCount=3
		//
		this.flipx=false
		this.ratation=1
		this.alpha=1
		//重力加速度
		this.gy=10
		this.vy=0
	}
	static new(game){
		return new this(game)
	}
	drawBlock(context,data,x,y,pixelWidth){
		const colors=[
			'white',
			'#FE1000',
			'#FFB010',
			'#AA3030',
		]

		let w=pixelWidth
		let h=pixelWidth
		for (let i=0; i<8; i++) {
			let p1=data[i]
			let p2=data[i+8]
			for (let j=0; j<8; j++) {
				//8bit /一行
				//在j循环中一次一个像素点
				//0100 1110 0100 0101
				let c1=(p1>>(7-j))&0b00000001
				let c2=(p2>>(7-j))&0b00000001
				let piexl=(c2<<1)+c1
				if(piexl==0)
					continue
				let color=colors[piexl]
				context.fillStyle=color
				let px=x+j*w
				let py=y+i*h
				context.fillRect(px,py,w,h)
			}
		}
	}
	drawSpite(){
		let date=this.date
		let context=this.game.context
		let piexlsPerBlock=8
		let pixelWidth=this.pixelWidth
		let blockSize=piexlsPerBlock*pixelWidth
		let offset =0
		for (let i = 0; i < this.rowsOfSprite; i++) {
			for (let j = 0;j< this.columsOfSprite; j++) {
					let x=j*blockSize
					let y=i*blockSize
					let piexls=data.slice(offset)
					this.drawBlock(context,piexls,x,y,pixelWidth)
					offset+=16
			}
		}
	}
	frames(){
		return this.animations[this.animationName]//??
	}
	jump(){
		this.vy=-10
	}
	update(){//自动执行的
		//更新受力
		// this.y+=this.vy
		// this.vy+=this.gy*0.2
		// let h=510
		// if (this.y>h) {
		// 	this.y=h
		// }
		this.frameCount--
		if(this.frameCount==0){
			this.frameCount=3
			this.frameIndex=(this.frameIndex+1)%this.frames
			// this.texture=this.frames[this.frameIndex]
		}
	}
	draw(){
		let context=this.game.context
		
	}
	move(x,keyStatue){
		this.flipx=(x<0)
		this.x+=x
	}
	setupInput(){
		let self=this
		let b=this.mario
		let playerSpeed=5
		self.game.registerAction('a',function(keyStatus){
			b.move(-playerSpeed,keyStatus)
		})
		self.game.registerAction('d',function(keyStatus){
			b.move(-playerSpeed,keyStatus)
		})
		self.game.registerAction('j',function(keyStatus){
			b.jump()
		})
	}
}