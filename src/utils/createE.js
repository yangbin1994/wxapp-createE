
import { isFunction, includes, set, get, clone, } from 'lodash'

const hookNames = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload']

const convertPath = (path) => path && path.slice(0, -1).replace('$', '.')

const createE = (option) => {
    // 动态变化
    // 位于树结构位置
    let path = ''

    // 默认处理
    option = {
        data: { __path__: path, },
        components: {},
        onLoad() { },
        onReady() { },
        onShow() { },
        onHide() { },
        onUnload() { },
        ...option,
    }

    for (let key in option) {
        if (!option.hasOwnProperty(key)) {
            break
        }
        if (isFunction(option[key])) {
            if (includes(hookNames, key)) {
                let hookName = key
                let oldHook = option[hookName]
                option[hookName] = function () {
                    // 调用子组件的hook
                    for (let tag in option.components) {
                        let component = option.components[tag]
                        let oldComponentHook = component[hookName]
                        component[hookName] = function () {
                            if (!this.__wrapped__) {
                                this.__wrapped__ = true
                                this.__setData__ = this.setData
                            }

                            this.getData = function () {
                                let outPath = convertPath(component.getPath())
                                return outPath ? get(this.data, outPath) : this.data
                            }

                            // 将setData进行封装
                            this.setData = function () {
                                let outPath = convertPath(component.getPath())

                                if (outPath) {
                                    arguments[0] =
                                        set(this.data, outPath, {
                                            ...get(this.data, outPath),
                                            ...arguments[0],
                                        })
                                }
                                this.__setData__.apply(this, arguments)
                            }

                            oldComponentHook.apply(this, arguments)
                        }
                        component[hookName].apply(this, arguments)
                    }

                    oldHook.apply(this, arguments)
                }
            } else {
                let handleName = key
                let oldHandle = option[handleName]
                option[handleName] = function () {
                    if (!this.__wrapped__) {
                        this.__wrapped__ = true
                        this.__setData__ = this.setData
                    }

                    this.getData = function () {
                        let outPath = convertPath(path)
                        return outPath ? get(this.data, outPath) : this.data
                    }

                    // 将setData进行封装
                    this.setData = function () {
                        let outPath = convertPath(path)
                        if (outPath) {
                            arguments[0] =
                                set(this.data, outPath, {
                                    ...get(this.data, outPath),
                                    ...arguments[0],
                                })
                        }
                        this.__setData__.apply(this, arguments)
                    }

                    oldHandle.apply(this, arguments)
                }
            }
        } else if (key === 'components') {
            // 对子组件进行处理
            for (let tag in option.components) {
                let component = option.components[tag]

                // 修改子组件的path
                component.setPath(tag)

                // 对子组件的handle进行改名
                for (let key in component) {
                    if (!component.hasOwnProperty(key)) {
                        break
                    }
                    if (isFunction(component[key]) && !includes(hookNames.concat([
                        'setPath',
                        'getPath',
                    ]), key)) {
                        let oldHandle = component[key]
                        delete component[key]
                        option[`${component.getPath()}${key}`] = oldHandle
                    }
                }

                // 对子组件的data进行赋值
                option.data[tag] = component.data
            }
        }
    }

    return {
        setPath(tag) {
            this.data.__path__ = path = `${tag}$${path}`
            for (let key in this.components) {
                if (!this.components.hasOwnProperty(key)) {
                    break
                }
                this.components[key].setPath(tag)
            }
        },
        getPath() {
            return path
        },
        ...option,
    }
}

export default createE