function Game () {
	var _this = this;
	Object.defineProperty(this,"score",{//每次score改变的时候，都会触发set
		set:function (val) {
			document.getElementsByTagName("span")[0].innerText = val;
			if (val == 2048) {
				_this.alert("成功！");
			}
		}
	})
	
	this.numArr = [];//存放每次操作后，显示在页面上的数字，排序后取最大值为分值
	this.init = function () {//初次打开页面进行初始化，或者点击newgame按钮，初始化
		this.spareGrid = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];//表示页面上当前空余的格子，第一行对应0,1,2,3，第二行对应4,5,6,7，第三行依次类推
		this.score = 0;
		//将所有格子置空
		this.spareGrid.forEach(function (item) {
			var curDiv = document.getElementsByClassName("grid-"+item)[0]
			curDiv.innerText = "";
			curDiv.className = "grid-"+item;
		})
		var onePos = Math.floor(Math.random()*16);
		this.spareGrid[onePos] = "no";//单元素数组，与字符串拼接时会自动转换为字符串
		var anotherPos = Math.floor(Math.random()*16);
		this.spareGrid[anotherPos] = "no";
		var allDivs = document.getElementById("wrap").getElementsByTagName("div").innerText = "";
		var oneDiv = document.getElementsByClassName("grid-"+onePos)[0];
		oneDiv.innerText = "2";
		oneDiv.className += " style-2 active";
		var anotherDiv = document.getElementsByClassName("grid-"+anotherPos)[0];
		anotherDiv.innerText = "2";
		anotherDiv.className += " style-2 active";
		console.log(this.spareGrid)
	};
	this.getOneNum = function () {
		var spareGrid = this.spareGrid.filter((item)=>item!="no");
		var len = spareGrid.length;
		if (len>0) {
			var onePos = spareGrid[Math.floor(Math.random()*len)];
			var oneDiv = document.getElementsByClassName("grid-"+onePos)[0];
			oneDiv.innerText = "2";
			oneDiv.className += " style-2 active";
			_this.spareGrid[onePos] = "no";//可用格子里 该项设置为no
		} else{
			_this.alert("游戏结束！")
		}
			
	};
	this.alert = function (msg) {
		document.getElementById("alert-msg").innerText = msg;
		document.getElementById("alert").style.visibility = "visible";
	}
	this.getScore = function () {
		var sortedNum = _this.quickSort(_this.numArr);
		_this.score = sortedNum.pop();
	};
	this.quickSort = function (arr){
	    if(arr.length<=1){
	       return arr;
	    }
	    var pivotIndex=Math.floor(arr.length/2);
	    var pivot=arr.splice(pivotIndex,1)[0];
	    var left=[];
	    var right=[];
	    for(var i=0;i<arr.length;i++){
	        if(arr[i]<pivot){
	           left.push(arr[i]);
	        }else{
	           right.push(arr[i]);
	        }
	    }
	    return _this.quickSort(left).concat(pivot).concat(_this.quickSort(right));
	};
	//判断当前操作是否可执行
	this.operate = function (op) {
		if (op) {
			_this.numArr.forEach(function (item,index) {
				var cur = document.getElementsByClassName("grid-"+index)[0];
				if (item) {
					cur.innerText = item;
					cur.className = cur.className.replace(/(style-\d+\s?|active)/gi,"").trim();
					cur.className += " style-"+item;
					_this.spareGrid[index] = "no";
				} else{
					cur.innerText = "";
					cur.className = cur.className.replace(/(style-\d+\s?|active)/gi,"").trim();
					_this.spareGrid[index] = index;
				}
			})
			this.getScore();//算分数
			this.getOneNum();//再获得一个数字
		}
	}
	//监听键盘的下箭头事件
	this.down = function () {
		this.numArr = [];
		var operate = false;
		for (var i = 0;i<4;i++) {//四列
			var arr = [];
			for (var j = 0;j<4;j++) {//先取得每列的四个元素的数值，存在在数组arr中
				var k = i+4*j;
				var num = document.getElementsByClassName("grid-"+k)[0].innerText;
				if (num) {
					arr.push(num);
				} else{
					arr.push(0);
				}
			}
			//判断是否可操作
			var str = arr.join("");
			var reg = /[1-9]+[0]+/;
			if (reg.test(str)) {
				operate = true;
			}
			arr.forEach(function (item,index) {
				if (item == 0) {
					arr.splice(index,1);
					arr.unshift(0);
				}
			})
			for (var n = 3;n>0;n--) {//对每列的四个数字进行合并
				if (arr[n] == arr[n-1] && arr[n]!=0) {
					arr[n] = arr[n-1]*2;
					arr.splice(n-1,1);
					arr.unshift(0);
					operate = true;
				}
			}
			arr.forEach(function (item,index) {//每列的四个数字对每列的四个格子进行样式更改，同时将非零数字添加到numArr数组，方便以后排序取最大值
				_this.numArr[i+4*index] = parseInt(item);
				
			})
		}
		this.operate(operate);
	};
	this.up = function () {
		this.numArr = [];//存在每个格子对应的数字
		var operate = false;
		for (var i = 0;i<4;i++) {//四列
			var arr = [];
			for (var j = 0;j<4;j++) {//先取得每列的四个元素的数值，存在在数组arr中
				var k = i+4*j;
				var num = document.getElementsByClassName("grid-"+k)[0].innerText;
				if (num) {
					arr.push(num);
				} else{
					arr.push(0);
				}
			}
			//判断是否可操作
			var str = arr.join("");
			var reg = /[0]+[1-9]+/;
			if (reg.test(str)) {
				operate = true;
			}
			for (var m = 3;m>=0;m--) {
				if (arr[m] == 0) {
					arr.splice(m,1);
					arr.push(0);
					
				}
			}
			for (var n = 0;n<4;n++) {//对每列的四个数字进行合并
				if (arr[n] == arr[n+1] && arr[n]!=0) {
					arr[n] = arr[n+1]*2;
					arr.splice(n+1,1);
					arr.push(0);
					operate = true;
				}
			}
			arr.forEach(function (item,index) {//每列的四个数字对每列的四个格子进行样式更改，同时将非零数字添加到numArr数组，方便以后排序取最大值
				_this.numArr[i+4*index] =  parseInt(item);
				
			})
		}
		this.operate(operate);
	};
	this.left = function () {
		this.numArr = [];
		var operate = false;
		for (var i = 0;i<4;i++) {//四行
			var arr = [];
			for (var j = 0;j<4;j++) {//先取得每行的四个元素的数值，存在在数组arr中
				var k = j+4*i;
				var num = document.getElementsByClassName("grid-"+k)[0].innerText;
				if (num) {
					arr.push(num);
				} else{
					arr.push(0);
				}
			}
			//判断是否可操作
			var str = arr.join("");
			var reg = /[0]+[1-9]+/;
			if (reg.test(str)) {
				operate = true;
			}
			for (var m = 3;m>=0;m--) {
				if (arr[m] == 0) {
					arr.splice(m,1);
					arr.push(0);
					
				}
			}
			for (var n = 0;n<4;n++) {//对每列的四个数字进行合并
				if (arr[n] == arr[n+1] && arr[n]!=0) {
					arr[n] = arr[n+1]*2;
					arr.splice(n+1,1);
					arr.push(0);
					operate = true;
				}
			}
			arr.forEach(function (item,index) {//每列的四个数字对每列的四个格子进行样式更改，同时将非零数字添加到numArr数组，方便以后排序取最大值
				_this.numArr[4*i+index] = parseInt(item);
				
			})
		}
		this.operate(operate)
	};
	this.right = function () {
		this.numArr = [];
		var operate = false;
		for (var i = 0;i<4;i++) {//四行
			var arr = [];
			for (var j = 0;j<4;j++) {//先取得每行的四个元素的数值，存在在数组arr中
				var k = j+4*i;
				var num = document.getElementsByClassName("grid-"+k)[0].innerText;
				if (num) {
					arr.push(num);
				} else{
					arr.push(0);
				}
			}
			//判断是否可操作
			var str = arr.join("");
			var reg = /[1-9]+[0]+/;
			if (reg.test(str)) {
				operate = true;
			}
			arr.forEach(function (item,index) {
				if (item == 0) {
					arr.splice(index,1);
					arr.unshift(0);
				}
			})
			for (var n = 3;n>0;n--) {//对每列的四个数字进行合并
				if (arr[n] == arr[n-1] && arr[n]!=0) {
					arr[n] = arr[n-1]*2;
					arr.splice(n-1,1);
					arr.unshift(0);
					operate = true;
				}
			}
			arr.forEach(function (item,index) {//每列的四个数字对每列的四个格子进行样式更改，同时将非零数字添加到numArr数组，方便以后排序取最大值
				_this.numArr[4*i+index] = parseInt(item);
				
			})
		}
		this.operate(operate);
	}
}
var newGame = new Game();
newGame.init();
var resetBtn = document.getElementsByTagName("button")[0];
var resetBtn2 = document.getElementsByTagName("button")[1];
resetBtn.addEventListener("click",function () {
	newGame.init();
})
resetBtn.addEventListener("touchstart",function () {
	newGame.init();
})
resetBtn2.addEventListener("click",function () {
	newGame.init();
	document.getElementById("alert").style.visibility = "hidden";
})
resetBtn2.addEventListener("touchstart",function () {
	newGame.init();
	document.getElementById("alert").style.visibility = "hidden";
})
//PC端键盘事件
document.onkeydown = function (event) {
	if (event.keyCode == 37) {
		newGame.left();
	} else if (event.keyCode == 38) {
		newGame.up();
	} else if (event.keyCode == 39) {
		newGame.right();
	} else if (event.keyCode == 40) {
		newGame.down();
	}
}
//移动端手势
var startX,startY,endX,endY;
document.ontouchstart = function (event) {
	startX = event.changedTouches[0].screenX;
	startY = event.changedTouches[0].screenY;
	console.log(startX,startY)
}

document.ontouchend = function (event) {
	event.preventDefault();
	endX = event.changedTouches[0].screenX;
	endY = event.changedTouches[0].screenY;
	console.log(endX,endY)
	var X = endX-startX;
	var Y = endY-startY;
	if (Math.abs(X)>Math.abs(Y)&&X>0) {
		newGame.right();
	} else if (Math.abs(X)>Math.abs(Y)&&X<0) {
		newGame.left();
	}  else if (Math.abs(X)<Math.abs(Y)&&Y>0) {
		newGame.down();
	} else if (Math.abs(X)<Math.abs(Y)&&Y<0) {
		newGame.up();
	} 
}

