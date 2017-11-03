# wxapp-createE

通过数据结构的转化，赋予了对小程序增加了 `自定义状态组件` 的能力。

# Usage
```bash
yarn && yarn remote 
```

```bash
yarn start
```

```js
const We = createE({
    data: {
        title: '我是Carousel的子组件We，我也有一个switch组件',
        intro: '点击我的时候，我的title会变成嘿嘿嘿',
    },
    onSwitch() {
        this.setData({
            title: this.getData().title === '嘿嘿嘿' ? '我是子组件We' : '嘿嘿嘿'
        })
    },
    onShow() {
        console.log('We show')
    }
})

const Carousel = createE({
    data: {
        title: '我是子组件Carousel',
        intro: '我有一个switch组件，点击的时候，我的title就会变成哈哈哈'
    },
    onSwitch() {
        this.setData({
            title: this.getData().title === '哈哈哈' ? '我是子组件Carousel' : '哈哈哈'
        })
    },
    onShow() {
        console.log('Carousel show')
    },
    components: {
        We,
    }
})

Page(connect(mapStateToProps)(createE({
  data: {
    title: '我是Root组件，我就一个title，和switch',
  },
  onShow() {
    console.log('Root show')
  },
  onSwitch() {
    this.setData({
      title: this.getData().title === '我依旧是Root组件' ? '我是Root组件' : '我依旧是Root组件'
    })
  },
  components: {
    Carousel,
  }
})))
```

# Note
* `yarn remote` 不是必选指令，它配合 `dva` 的 `extraEnhancers` 可以展示 `redux-dev-tools` 界面。

* html内部要引入组件下 `components` 声明的组件，并且传入键值；父组件可以用es6的对象展开写法实现覆盖效果。

```html
<import src="../../components/Carousel/index.wxml" />

<view class="container">
  <text>{{outsideName}}</text>
  <text>{{title}}</text>
  <switch checked bindchange="onSwitch"/>
  <!-- <template is="Carousel" data="{{ ...Carousel }}" /> -->
  <template is="Carousel" data="{{ ...Carousel,  title: 'Root覆盖了Carousel的Title' }}" />
</view>
```

* 如果对非 `Page` 组件进行`connect` 到 `redux`，需要对 `wechat-wxapp-redux` 源码进行修改，将浅比较 `data` 的地方：`this.data` 替换为 `this.getData()`

* 子组件的样式需要相应引入，命名空间要人工维护

# License
MIT