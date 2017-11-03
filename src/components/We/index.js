import { connect } from 'wechat-wxapp-redux';
import createE from 'utils/createE'

export default createE({
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