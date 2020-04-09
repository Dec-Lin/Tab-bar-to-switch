//  功能需求
// 1、点击tab栏可以切换的效果
// 2、点击 + 号可以添加 tab 项和内容项
// 3、点击 x 号可以删除当前的tab项和内容项
// 4、双击tab项文字或者内容项文字可以修改里面的文字内容
let that
class Tab {
    constructor(id) {
        that = this
        this.main = document.querySelector(id)
        this.add = this.main.querySelector('.tab-add')
        this.ul = this.main.querySelector('.tabTop ul:first-child')
        this.fatSection = this.main.querySelector('.tab-section')
        this.init()
    }
    //因为是动态添加元素，所以要执行此函数重新获取对应的元素，否则会报错
    updateNode() {
        this.lis = this.main.querySelectorAll('li')
        this.section = this.main.querySelectorAll('section')
        this.remove = this.main.querySelectorAll('.close')
        this.span = this.main.querySelectorAll('.tabTop li span')
    }

    //初始化,让相关元素绑定事件
    init() {
        this.updateNode()
        this.add.onclick = this.addTab //
        for (let i = 0; i < this.lis.length; i++) {
            this.lis[i].index = i
            this.lis[i].onclick = this.toggleTab
            this.remove[i].onclick = this.delTab
            this.span[i].ondblclick = this.editTab
            this.section[i].ondblclick = this.editTab
        }
    }
    //1、切换
    toggleTab() {
        that.clearClass()
        this.className = 'li-active'
        that.section[this.index].className = ''
    }
    //1.1 清除所有li的 class,并且给所有section添加class
    clearClass() {
        for (let i = 0; i < this.lis.length; i++) {
            this.lis[i].className = ''
            this.section[i].className = 'sec-none'
        }
    }

    //2、添加
    addTab() {
        that.clearClass()
        //1、创建li和section
        let random = Math.random()
        let li = '<li class="li-active"><span>新选项卡</span><button class="close">x</button></li>'
        let _section = '<section>新测试' + random + '</section>'
        that.ul.insertAdjacentHTML('beforeEnd', li)
        that.fatSection.insertAdjacentHTML('beforeEnd', _section)
        that.init()
    }
    //3、删除
    delTab(e) {
        e.stopPropagation() //阻止事件冒泡,防止触发li的切换事件
        let index = this.parentNode.index
        that.lis[index].remove()  //remove()方法可以直接删除指定的元素
        that.section[index].remove()
        that.init()
        //实现当要删除的不是选定状态的li时，原来的选定状态li保持选定状态
        if (document.querySelector('.li-active')) {
            return
        }
        //实现当删除了当前选定状态li的时候，让它的前一个li处于选定状态
        index--
        that.lis[index] && that.lis[index].click() //调用前一个li的点击事件
    }
    //4、修改
    editTab() {
        //核心思路：双击文字时，在里面生成一个文本框，当时去焦点或按下回车后把文本框里的内容赋值给原先的元素即可。
        let str = this.innerHTML
        //禁止双击选中文字：
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        this.innerHTML = '<input type="text" />'
        let input = this.children[0]
        input.value = str
        input.select()//使文本框里的文字处于选定状态
        //当鼠标点击文本框之外的地方时就把文本框里面的值给赋值给span
        //onblur事件，会在对象失去焦点时触发
        input.onblur = function () {
            //this的指向问题，这里的this.parentNode 为span
            this.parentNode.innerHTML = this.value
        }
        //按下回车也可以把文本框的值给span
        input.onkeyup = function (e) {
            if (e.keyCode === 13) {
                //相当于使用回车键调用了blur事件
                this.blur()
            }
        }
    }
}
new Tab('#tab')