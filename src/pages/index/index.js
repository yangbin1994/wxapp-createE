import { connect } from 'wechat-wxapp-redux';
import Carousel from '../../components/Carousel/index.js';
import createE from 'utils/createE'

const mapStateToProps = (state) => state.app

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
