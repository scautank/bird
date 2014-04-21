/**
 * Created by wlcan on 14-4-5.
 */
window.onload = function(){
    game.init('wrapMain');

    var bStop = true;
    document.onkeydown = function(ev){
        var ev = ev || window.event;
        if(ev.keyCode == 32)
        {
            if(bStop)
            {
                game.gameStart();
                bStop = false;
                clearInterval(this.startFlyTimer);
            }
        }
    };
};

var game = {

    init : function(id){   //游戏初始化
        this.oParent = document.getElementById(id);
        this.bird = document.getElementById('bird');
        this.bamboo = document.getElementById('bamboo');
        this.score = document.getElementById('score');

        this.iScore = 0;

        var iSpeed = 1;
        this.startFlyTimer = setInterval(function(){
            if(this.bird.offsetTop > 240)
            {
                iSpeed *= -1;
            }
            else if(this.bird.offsetTop < 228)
            {
                iSpeed *= -1;
            }
            this.bird.style.top = this.bird.offsetTop + iSpeed + 'px';
        },30);
    },

    gameStart : function(){   //开始游戏
        this.tap = document.getElementById('tap');
        this.tap.style.display = 'none';
        var This = this;
        var iSpeed = -4;

        this.addBamboo(4);
        this.moveBamboo(iSpeed);

        document.onkeyup = function(ev){
            var ev = ev || window.event;
            if(ev.keyCode == 32)
            {
                This.birdFly();
            }
        };
    },

    birdFly : function(){   //小鸟运动
        var _this = this;
        var iSpeed = -26;
        var iX = 2;
        var iMaxTop = this.oParent.offsetHeight - this.bird.offsetHeight;

        clearInterval(this.flyTimer);
        this.flyTimer = setInterval(function(){
            iSpeed += iX;
            iX*=1.02;
            //按照重力公式来计算
            var iTop =  _this.birdGravity(_this.bird.offsetTop, 30, 0.08) + iSpeed;

            if(iTop < iMaxTop + 4)
            {
                iSpeed *= 0.7;
            }
            else if( iTop < 0 )
            {
                iTop = 0;
            }
            else
            {
                iTop = iMaxTop + 3;
            }
            _this.bird.style.top = iTop + 'px';

            //检测是否碰撞
            _this.aBambooTop = app.getByClass(_this.bamboo, 'bambooTop');
            _this.aBambooBottom = app.getByClass(_this.bamboo, 'bambooBottom');

            for(var i=0; i<_this.aBambooTop.length; i++)
            {
                if(_this.pz(_this.bird, _this.aBambooTop[i]) || _this.pz(_this.bird, _this.aBambooBottom[i]) || _this.bird.offsetTop < 0)
                {
                    alert('游戏结束！');
                    clearInterval(_this.flyTimer);
                    window.location.reload();
                }
            }

            //计算前两根柱子
            var L_Bird = _this.bird.offsetLeft;
            var R_Bamboo = _this.bamboo.offsetLeft + _this.aBambooTop[0].parentNode.offsetLeft + _this.aBambooTop[0].offsetWidth + _this.aBambooTop[0].offsetLeft;
            if(_this.iScore == 0 && L_Bird> R_Bamboo)
            {
                _this.iScore += 1;
                _this.score.innerHTML = _this.iScore;
            }
            else if(_this.iScore == 1)
            {
                _this.iScore ++;
            }
        },40);
    },

    birdGravity : function(y, h, t, g){    //按照重力计算top值
        g = g || 0.98;
        return y + (Math.sqrt(2 * h * g) * t - 0.5 * g * t * t);
    },

    addBamboo : function(iNum){       //开始游戏时候生成竹子
        this.bamboo.style.left = document.getElementById('wrap').offsetWidth + 'px';
        //创建竹子
        for(var i=0; i<iNum ;i++)
        {
            var oLi = document.createElement('li');
            oLi.innerHTML = '<div class="bambooTop"><div class="bambooTopBg"></div></div><div class="bambooBottom"><div class="bambooBottomBg"></div></div>';
            this.createBamboo(oLi);
            this.bamboo.appendChild(oLi);
        }

        var aLi = this.bamboo.getElementsByTagName('li');

        this.bamboo.style.width = (aLi[0].offsetWidth + 160) * iNum + 'px';
        //设置竹子的left值
        for(var i=0; i<aLi.length; i++)
        {
            aLi[i].style.left = i * (aLi[0].offsetWidth + 160) + 'px';
        }
    },

    createBamboo : function(obj){   //随机生成上下竹子高度
        //取li
        var aBamboo = obj.children;

        var iHeight = Math.round(Math.random()*(this.oParent.offsetHeight - 120 - 2*40));

        aBamboo[0].style.height = iHeight + 40 + 'px';
        aBamboo[1].style.height = this.oParent.offsetHeight - iHeight - 120 - 2*40 + 40 + 'px';

    },

    moveBamboo : function(iSpeed){   //竹子移动
        var aLi = this.bamboo.getElementsByTagName('li');

        var _this = this;
        setInterval(function(){
            _this.bamboo.style.left = _this.bamboo.offsetLeft + iSpeed + 'px';
            if(_this.bamboo.offsetLeft < -(aLi[0].offsetWidth + 160))
            {
                //重新计算第一个li中上下竹子的高度
                _this.createBamboo(_this.bamboo.children[0]);
                _this.bamboo.appendChild(_this.bamboo.children[0]);
                //计分
                _this.score.innerHTML = _this.iScore++;
                //重新定位
                for(var i=0; i< aLi.length; i++)
                {
                    aLi[i].style.left = i * (aLi[0].offsetWidth + 160) + 'px';
                }
                _this.bamboo.style.left = aLi[0].offsetWidth + 160 + _this.bamboo.offsetLeft + 'px';
            }
        },30);
    },

    pz : function(obj1, obj2){  //碰撞检测
        var L1 = obj1.offsetLeft;
        var R1 = obj1.offsetLeft + obj1.offsetWidth;
        var T1 = obj1.offsetTop;
        var B1 = obj1.offsetTop + obj1.offsetHeight;

        var L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft + this.bamboo.offsetLeft;
        var R2 = obj2.offsetLeft + obj2.offsetWidth +obj2.parentNode.offsetLeft + this.bamboo.offsetLeft;
        var T2 = obj2.offsetTop + obj2.parentNode.offsetTop;
        var B2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop;

        //如果没有发生碰撞返回false
         if(L1 > R2 || L2 > R1 || T1 > B2 || T2 > B1)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
};

var app = {
    getByClass : function(oParent, sClass)  //取class
    {
        var aEle=oParent.getElementsByTagName('*');
        var aResult=[];
        var re=new RegExp('\\b'+sClass+'\\b', 'i');

        for(var i=0;i<aEle.length;i++)
        {
            if(re.test(aEle[i].className))
            {
                aResult.push(aEle[i]);
            }
        }

        return aResult;
    }
};