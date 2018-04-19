function Game () {
	var _this = this;
	Object.defineProperty(this,"score",{//每次score改变的时候，都会触发set
		set:function (val) {
			document.getElementsByTagName("span")[0].innerText = val;
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
		var onePos = this.spareGrid.splice(Math.floor(Math.random()*this.spareGrid.length),1);//单元素数组，与字符串拼接时会自动转换为字符串
		var anotherPos = this.spareGrid.splice(Math.floor(Math.random()*this.spareGrid.length),1);
		var allDivs = document.getElementById("wrap").getElementsByTagName("div").innerText = "";
		var oneDiv = document.getElementsByClassName("grid-"+onePos)[0];
		oneDiv.innerText = "2";
		oneDiv.className += " active";
		var anotherDiv = document.getElementsByClassName("grid-"+anotherPos)[0];
		anotherDiv.innerText = "2";
		anotherDiv.className += " active";
		console.log(this.spareGrid)
	};
	this.getOneNum = function () {
		var len = this.spareGrid.length;
		if (len>0) {
			var onePos = this.spareGrid.splice(Math.floor(Math.random()*len),1);
			var oneDiv = document.getElementsByClassName("grid-"+onePos)[0];
			oneDiv.innerText = "2";
			oneDiv.className += " active";
		} else{
			alert("游戏结束！")
		}
			
	};
	this.getScore = function () {
		this.score = this.quickSort(_this.numArr).pop();
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
	    return _this.quickSort(left).concat([pivot],_this.quickSort(right));
	};
	//监听键盘的下箭头事件
	this.down = function () {
		this.numArr = [];
		var operate = false;
		for (var i = 0;i<4;i++) {//四列
			var arr = [];
			for (var j = 0;j<4;j++) {//先取得每列的四个元素的数值，存在在数组arr中，注意点是，如果为空则在数组前边添加0，否则将数字push到数组后边
				var k = i+4*j;
				var num = document.getElementsByClassName("grid-"+k)[0].innerText;
				if (num) {
					arr.push(num);
				} else{
					arr.unshift(0);
				}
			}
			for (var n = 3;n>0;n--) {//对每列的四个数字进行合并
				if (arr[n] == arr[n-1]) {
					arr[n] = arr[n-1]*2;
					arr.splice(n-1,1);
					arr.unshift(0);
				}
			}
			arr.forEach(function (item,index) {//每列的四个数字对每列的四个格子进行样式更改，同时将非零数字添加到numArr数组，方便以后排序取最大值
				var cur = document.getElementsByClassName("grid-"+(i+4*index))[0];
				if (item) {
					cur.innerText = item;
					cur.className += " active";
					_this.spareGrid.forEach(function (item,index2) {
						if (item == i+4*index) {
							_this.spareGrid.splice(index2,1)
						}
					})
					_this.numArr.push(item);
				} else{
					cur.innerText = "";
					cur.className = cur.className.replace(/active/gi,"");
					var spare = i+4*index;
					if(_this.spareGrid.indexOf(spare) == -1) {
						_this.spareGrid.push(spare);
					}

				}
			})
		}
		this.getScore();//算分数
		this.getOneNum();//再获得一个数字
	};
	this.up = function () {
		
	};
	this.left = function () {
		
	};
	this.right = function () {
		this.numArr = [];
		for (var i = 0;i<4;i++) {//四行
			var arr = [];
			for (var j = 0;j<4;j++) {//先取得每行的四个元素的数值，存在在数组arr中，注意点是，如果为空则在数组前边添加0，否则将数字push到数组后边
				var k = j+4*i;
				var num = document.getElementsByClassName("grid-"+k)[0].innerText;
				if (num) {
					arr.push(num);
				} else{
					arr.unshift(0);
				}
			}
			for (var n = 3;n>0;n--) {//对每行的四个数字进行合并
				if (arr[n] == arr[n-1]) {
					arr[n] = arr[n-1]*2;
					arr.splice(n-1,1);
					arr.unshift(0);
				}
			}
			arr.forEach(function (item,index) {//每行的四个数字对每列的四个格子进行样式更改，同时将非零数字添加到numArr数组，方便以后排序取最大值
				var cur = document.getElementsByClassName("grid-"+(4*i+index))[0];
				if (item) {
					cur.innerText = item;
					cur.className += " active";
					_this.spareGrid.forEach(function (item,index2) {//在空余格子数组里 删除填充了内容的这一项
						if (item == 4*i+index) {
							_this.spareGrid.splice(index2,1)
						}
					})
					_this.numArr.push(item);
				} else{
					cur.innerText = "";
					cur.className = cur.className.replace(/active/gi,"");
					var spare = i+4*index;
					if(_this.spareGrid.indexOf(spare) == -1) { //在空余格子数组里增加一项
						_this.spareGrid.push(spare);
					}

				}
			})
		}
		this.getScore();//算分数
		this.getOneNum();//再获得一个数字
	}
}
var newGame = new Game();
newGame.init();
var resetBtn = document.getElementsByTagName("button")[0];
resetBtn.addEventListener("click",function () {
	newGame.init();
})
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
