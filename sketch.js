/*
By Okazz
*/
let colors = ['#7bdff2', '#b2f7ef', '#f7d6e0', '#f2b5d4'];
let ctx;
let motions = [];
let motionClasses = [];
let sceneTimer = 0;
let resetTime = 60 * 8.5;
let fadeOutTime = 30;

// 新增：隱藏選單變數
let menuWidth = 320;
let menuX = -menuWidth;
let menuTargetX = -menuWidth;
let menuEasing = 0.12;
let menuItems = ['第一單元作品', '第一單元講義', '測驗系統', '回到首頁'];
let menuTextSize = 32;
let iframeElem = null; // 新增：iframe 參考

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	ctx = drawingContext;
	INIT();
}

function draw() {
    background('#eff7f6');
    for (let m of motions) {
        m.run();
    }

    let alph = 0;
    if ((resetTime - fadeOutTime) < sceneTimer && sceneTimer <= resetTime) {
        alph = map(sceneTimer, (resetTime - fadeOutTime), resetTime, 0, 255);
        background(255, alph);

    }

    if (frameCount % resetTime == 0) {
        INIT();
    }

    sceneTimer++;

    // 新增：選單滑出邏輯（當滑鼠在最左側 100px 時滑出）
    if (mouseX <= 100) {
        menuTargetX = 0;
    } else {
        menuTargetX = -menuWidth;
    }
    menuX = lerp(menuX, menuTargetX, menuEasing);

    // 在最上層繪製選單
    drawMenu();
}

function INIT() {
	sceneTimer = 0;
	motions = [];
	motionClasses = [Motion01, Motion02, Motion03, Motion04, Motion05];
	let drawingRegion = width * 0.75;
	let cellCount = 25;
	let cellSize = drawingRegion / cellCount;
	let clr = '#415a77';
	for (let i = 0; i < cellCount; i++) {
		for (let j = 0; j < cellCount; j++) {
			let x = cellSize * j + (cellSize / 2) + (width - drawingRegion) / 2;
			let y = cellSize * i + (cellSize / 2) + (height - drawingRegion) / 2;
			let MotionClass = random(motionClasses);
			let t = -int(dist(x, y, width / 2, height / 2) * 0.7);
			motions.push(new MotionClass(x, y, cellSize, t, clr));
		}
	}
}

function easeInOutQuint(x) {
	return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

class Agent {
	constructor(x, y, w, t, clr) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.t1 = int(random(30, 100));
		this.t2 = this.t1 + int(random(30, 100));
		this.t = t;
		this.clr2 = color(clr);
		this.clr1 = color(random(colors));
		this.currentColor = this.clr1;
	}

	show() {
	}

	move() {
		if (0 < this.t && this.t < this.t1) {
			let n = norm(this.t, 0, this.t1 - 1);
			this.updateMotion1(easeInOutQuint(n));
		} else if (this.t1 < this.t && this.t < this.t2) {
			let n = norm(this.t, this.t1, this.t2 - 1);
			this.updateMotion2(easeInOutQuint(n));
		}
		this.t++;
	}

	run() {
		this.show();
		this.move();
	}

	updateMotion1(n) {

	}
	updateMotion2(n) {

	}

}

class Motion01 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 3;
		this.ang = int(random(4)) * (TAU / 4);
		this.size = 0;
	}

	show() {
		noStroke();
		fill(this.currentColor);
		square(this.x + this.shift * cos(this.ang), this.y + this.shift * sin(this.ang), this.size);
	}

	updateMotion1(n) {
		this.shift = lerp(this.w * 3, 0, n);
		this.size = lerp(0, this.w, n);
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
	}
}

class Motion02 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 2;
		this.ang = int(random(4)) * (TAU / 4);
		this.size = 0;
		this.corner = this.w / 2;
	}

	show() {
		noStroke();
		fill(this.currentColor);
		square(this.x + this.shift * cos(this.ang), this.y + this.shift * sin(this.ang), this.size, this.corner);
	}

	updateMotion1(n) {
		this.shift = lerp(0, this.w * 2, n);
		this.size = lerp(0, this.w / 2, n);
	}

	updateMotion2(n) {
		this.size = lerp(this.w / 2, this.w, n);
		this.shift = lerp(this.w * 2, 0, n);
		this.corner = lerp(this.w / 2, 0, n);
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
	}
}

class Motion03 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 2;
		this.ang = 0;
		this.size = 0
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.ang);
		noStroke();
		fill(this.currentColor);
		square(0, 0, this.size);
		pop();
	}

	updateMotion1(n) {
		this.ang = lerp(0, TAU, n);
		this.size = lerp(0, this.w, n);
		this.currentColor = lerpColor(this.clr1, this.clr2, n);

	}
}

class Motion04 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 2;
		this.ang = int(random(4)) * (TAU / 4);
		this.rot = PI;
		this.side = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.ang);
		translate(-this.w / 2, -this.w / 2);
		rotate(this.rot);
		fill(this.currentColor);
		rect(this.w / 2, (this.w / 2) - (this.w - this.side) / 2, this.w, this.side);
		pop();
	}

	updateMotion1(n) {
		this.side = lerp(0, this.w, n);
	}

	updateMotion2(n) {
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
		this.rot = lerp(PI, 0, n);
	}
}

class Motion05 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w / 2;
		this.size = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		for (let i = 0; i < 4; i++) {
			fill(this.currentColor);
			square((this.w / 4) + this.shift, (this.w / 4) + this.shift, this.size);
			rotate(TAU / 4);
		}
		pop();
	}

	updateMotion1(n) {
		this.size = lerp(0, this.w / 4, n);
	}

	updateMotion2(n) {
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
		this.shift = lerp(this.w / 2, 0, n);
		this.size = lerp(this.w / 4, this.w / 2, n);

	}
}

// 新增：繪製選單（文字大小 32px）
function drawMenu() {
    push();
    translate(menuX, 0);

    // 背景
    noStroke();
    fill('#2b2b2b');
    rect(menuWidth / 2, height / 2, menuWidth, height);

    // 選單文字
    textSize(menuTextSize);
    textAlign(LEFT, TOP);

    let startY = 80;
    let gap = 88;
    for (let i = 0; i < menuItems.length; i++) {
        let y = startY + i * gap;
        // 判斷滑鼠是否在選單與該項目上（考慮 menuX 偏移）
        let relMouseX = mouseX - menuX;
        let hovered = relMouseX >= 0 && relMouseX <= menuWidth && mouseY >= y && mouseY <= y + 48;

        if (hovered) {
            fill('#ffd166'); // hover 顏色
        } else {
            fill(255); // 文字顏色
        }
        // 左內距 40
        text(menuItems[i], 40, y);
    }
    pop();
}

// 新增：顯示 / 隱藏 / 調整 iframe 的函式
function showIframe(url) {
    if (!iframeElem) {
        iframeElem = createElement('iframe');
        iframeElem.attribute('frameborder', '0');
        iframeElem.style('position', 'fixed');
        iframeElem.style('z-index', '9999');
        iframeElem.style('background', '#ffffff');
        iframeElem.style('box-shadow', '0 8px 24px rgba(0,0,0,0.4)');
    }
    iframeElem.attribute('src', url);
    iframeElem.style('display', 'block');
    resizeIframe();
}

function hideIframe() {
    if (iframeElem) {
        iframeElem.style('display', 'none');
        // 若要一律移除可以改用 iframeElem.remove(); iframeElem = null;
    }
}

function resizeIframe() {
    if (!iframeElem) return;
    let w = floor(windowWidth * 0.8); // 寬為視窗 80%
    let h = floor(windowHeight * 0.8); // 高設定為視窗 80%
    let left = floor((windowWidth - w) / 2);
    let top = floor((windowHeight - h) / 2);
    iframeElem.style('width', w + 'px');
    iframeElem.style('height', h + 'px');
    iframeElem.style('left', left + 'px');
    iframeElem.style('top', top + 'px');
}

// 在視窗大小改變時同步調整 iframe
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resizeIframe();
}

// 修改：滑鼠點擊選單回報並處理第一單元作品（以 iframe 顯示）
function mousePressed() {
    let relMouseX = mouseX - menuX;
    if (relMouseX >= 0 && relMouseX <= menuWidth) {
        let startY = 80;
        let gap = 88;
        for (let i = 0; i < menuItems.length; i++) {
            let y = startY + i * gap;
            if (mouseY >= y && mouseY <= y + 48) {
                console.log('選取項目：' + menuItems[i]);
                if (i === 0) {
                    // 第一單元作品：以 iframe 顯示 GitHub Pages 網站
                    // 注意：GitHub 儲存庫頁面無法在 iframe 中顯示，需要使用發佈後的 GitHub Pages 網址
                    showIframe('https://cos1n3nk-cell.github.io/20251027/');
                } else if (i === 1) {
                    // 第一單元講義：以 iframe 顯示 HackMD 頁面
                    showIframe('https://hackmd.io/@cosine6/Sy0kF7Asgx');
                } else if (i === 2) {
                    // 測驗系統：在新分頁開啟
                    window.open('https://docs.google.com/forms/d/e/1FAIpQLScyfG9xGBAZYli2AWo-TqgXjJjYjYjYjYjYjYjYjYjYjYjYjY/viewform', '_blank');
                    hideIframe();
                } else if (i === 3) {
                    // 回到首頁：呼叫 INIT() 函數重置動畫
                    INIT();
                    hideIframe();
                } else {
                    // 其他選項：隱藏 iframe（或改為其他行為）
                    hideIframe();
                }
            }
        }
    } else {
        // 若使用者點擊畫布其他地方，可選擇關閉 iframe
        // hideIframe();
    }
}