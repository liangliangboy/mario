//初始化元素选择器和日志函数
let e = sel => document.querySelector(sel)
let log = console.log.bind(console)


//跨域函数
//以二进制打开nes文件
const ajax = request => {
	let r = new XMLHttpRequest()
	r.open('GET', request.url, true)
	r.responseType = 'arraybuffer'
	r.onreadystatechange = event => {
		if (r.readyState == 4) {
			request.callback(r.response)
		}
	}
	r.send();
}
//绘画每一个像素点
//在context中的x,y位置绘制像素点
const drawBlock = (context, data, x, y, pixelWidth) => {
	const colors = [
		'white',
		'#FE1000',
		'#FFB010',
		'#AA3030',
	]

	let w = pixelWidth
	let h = pixelWidth
	for (let i = 0; i < 8; i++) {
		let p1 = data[i]
		let p2 = data[i + 8]
		for (let j = 0; j < 8; j++) {
			//8bit /一行
			//在j循环中一次一个像素点
			//0100 1110 0100 0101
			let c1 = (p1 >> (7 - j)) & 0b00000001
			let c2 = (p2 >> (7 - j)) & 0b00000001
			let piexl = (c2 << 1) + c1
			let color = colors[piexl]
			context.fillStyle = color
			let px = x + j * w
			let py = y + i * h
			context.fillRect(px, py, w, h)
			//提取数据，绘制有坐标，大小的点，不要理解为一个像素点长宽是1px
		}

	}

}
//将Nes文件提取的数据可视化
const drawNes = bytes => {
	//78,69
	//0100 1110 0100 0101
	let canvas = document.getElementById('id-canvas')

	//e("#id-canvas")
	let context = canvas.getContext('2d')
	let blockSize = 8//一个土块8像素
	let pixelSize = 8 //一个像素8位
	let pixelWidth = 10 //放大10倍
	let numberOfBytesPerBlock = 16
	for (let i = 0; i < blockSize; i++) {
		for (let j = 0; j < blockSize; j++) {
			//算出bytes
			let x = j * pixelSize * pixelWidth
			let y = i * pixelSize * pixelWidth
			let index = window.offset + (i * 8 + j) * numberOfBytesPerBlock
			drawBlock(context, bytes.slice(index), x, y, pixelWidth)
		}
	}
}
//绘制
// context 画布
// data 绘制数据
// w 几行大像素 比如1*1 或者 2*1
// h 几列大像素 同上
const drawSprite = (context, data, px, py, w, h) => {
	let piexlsPerBlock = 8
	let pixelWidth = 10
	let blockSize = piexlsPerBlock * pixelWidth
	let offset = 0
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			let x = (px + j) * blockSize
			let y = (py + i) * blockSize
			let piexls = data.slice(offset)
			drawBlock(context, piexls, x, y, pixelWidth)
			offset += 16
		}
	}
}

//修改h3标签数据
const actions = {
	change_offset(event) {
		let offset = Number(event.target.dataset.offset)
		window.offset += offset
		e('h3').innerHTML = window.offset
		drawNes(window.bytes)
	},
	draw_title(event) {
		let target = event.target
		log(target)
		let rect = target.getBoundingClientRect()
		let x = event.clientX - rect.left
		let y = event.clientY - rect.top
		let i = Math.floor(x / 80)
		let j = Math.floor(y / 80)

		let bytesPerBlock = 16
		let type = target.dataset.type

		if (type == 'source') {
			let offset = i * bytesPerBlock + bytesPerBlock * 8 * j
			window.titleOffset = offset + window.offset
		} else if (type == 'title') {
			let data = window.bytes.slice(window.titleOffset)
			drawSprite(target.getContext('2d'), data, i, j, 1, 1)
		}

		log("draw_title", i, j, type)
	}
}
//绑定按钮事件
/*
p暂停
a,← 左走
d,→ 右走
*/
let px = 0
let py = 0

let leftDown = false
let rightDown = false

//速度
let speed = 20
const bindEvents = (context) => {
	log("bind", "bing")
	// e('body').addEventListener('click',event=>{

	// })
	e("body").addEventListener('click', event => {
		let action = event.target.dataset.action
		// let offset=Number(event.target.dataset.offset)
		// log("offset",offset)
		actions[action] && actions[action](event)
	})
	window.addEventListener('keydown', event => {
		// log("key",event.key)
		if (event.key == 'p') {
			window.paused = !window.paused
		}
		if (event.key == 'a' || event.key == 'ArrowLeft') {
			leftDown = true
		}
		if (event.key == 'd' || event.key == 'ArrowRight') {
			rightDown = true
		}
	})
	window.addEventListener('keyup', event => {
		if (event.key == 'a' || event.key == 'ArrowLeft') {
			leftDown = false
		}
		if (event.key == 'd' || event.key == 'ArrowRight') {
			rightDown = false
		}
	})
}
//主函数

const _main = () => {
	window.paused = false
	window.offset = 32784
	let titleOffset = 32784
	let bytesPerBlock = 16
	let titesPerSprite = 8
	let bytesPerSprite = bytesPerBlock * titesPerSprite
	let context = e('#id-canvas-spite').getContext('2d')
	let context_ani = e('#id-canvas-ani').getContext('2d')
	let request = {
		url: 'mario.NES',
		callback(r) {
			window.bytes = new Uint8Array(r)
			//log('byte',bytes)
			drawNes(bytes)
			let step = 0


			setInterval(function () {
				let offset = titleOffset + step * bytesPerSprite
				if (leftDown) {
					px -= speed
				} else if (rightDown) {
					px += speed
				}
				context.clearRect(0, 0, context.canvas.width, context.canvas.height)
				drawSprite(context, bytes.slice(offset), px, py, 2, 4)
				context_ani.clearRect(0, 0, context_ani.canvas.width, context_ani.canvas.height)
				drawSprite(context_ani, bytes.slice(offset), px, py, 2, 4)
				if (window.paused) {
					//pause
				} else {
					step++
					step %= 3
				}
			}, 200)

		}
	}
	ajax(request)
	bindEvents(context)
}
//调用主函数
_main()