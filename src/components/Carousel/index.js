import { connect } from 'wechat-wxapp-redux';
import createE from 'utils/createE'
import We from '../We/index.js'

export default createE({
    data: {
        title: '我是子组件Carousel',
        intro: '，我有一个switch组件，点击的时候，我的title就会变成哈哈哈'
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

