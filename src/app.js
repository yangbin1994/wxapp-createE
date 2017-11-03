import * as core from 'dva-core';
// import createLogger from 'redux-logger';
import createLoading from 'dva-loading';
import models from './models/index.js';
import { Provider } from 'wechat-wxapp-redux'

const option = {}

if (__DEV__) {
  const devTools = require('./lib/remote-redux-devtools.js').default
  option.extraEnhancers = [
    devTools({
      hostname: 'localhost',
      port: 5678,
      secure: false
    })
  ]
}

//创建app
const dvapp = core.create(option);

//加载model
models.forEach(model => {
  dvapp.model(model);
});

dvapp.use(createLoading({ effects: true }));

//启动app
dvapp.start();

//初始化App()
const config = {
  onLaunch() {
    dvapp._store.dispatch({ type: 'app/init' });
  },
};

App(Provider(dvapp._store)(config));


