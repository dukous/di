
const SLOT = '__slot__';

let descriptors = {};
let singleServices = {};
let requestServiceKeys = [];

/**
 * 获取单例服务
 * @param id
 * @return {*}
 */
function getSingleService(id) {
    if(singleServices[id] && singleServices[id][SLOT])
        return singleServices[id][SLOT];
    return singleServices[id];
}

/**
 * 获取请求服务
 * @param id
 * @param requestServices
 * @return {*}
 */
function getRequestService(id, requestServices) {
    if(requestServices[id] && requestServices[id][SLOT])
        return requestServices[id][SLOT];
    return requestServices[id];
}

/**
 * 获取服务槽
 */
function getServiceSlot() {
    return { [SLOT]: null };
}

/**
 * 依赖注入
 */
class DI {
    /**
     * 获取服务
     * @param {string} id
     * @return {*}
     */
    static getService(id) {
        let descriptor = descriptors[id];
        if(descriptor) {
            if(descriptor.single)
                return singleServices[id];
        } else {
            return null;
        }

        let requestServices = {};
        requestServiceKeys.forEach(key => {
            let descriptor = descriptors[key];
            if(!descriptor.single) {
                requestServices[key] = getServiceSlot();
            }
        });
        requestServiceKeys.forEach(key => {
            let descriptor = descriptors[key];
            if(descriptor.args && descriptor.args.length > 0) {
                let args = descriptor.args.map((arg) => arg.ref ? (requestServices[arg.ref] ? requestServices[arg.ref] : getSingleService(arg.ref)) : arg.value);
                requestServices[key][SLOT] = new descriptor.constructor(...args);
            } else {
                requestServices[key][SLOT] = new descriptor.constructor();
            }
        });
        requestServiceKeys.forEach(key => {
            requestServices[key] = getRequestService(key, requestServices);
            let descriptor = descriptors[key];
            if(descriptor.args && descriptor.args.length > 0) {
                descriptor.args.forEach((arg) => {
                    if(arg.ref) {
                        if (descriptors[arg.ref].single) {
                            requestServices[key][arg.ref] = getSingleService(arg.ref);
                        } else {
                            requestServices[key][arg.ref] = getRequestService(arg.ref, requestServices);
                        }
                    }
                });
            }
            if(descriptor.props) {
                descriptor.props.forEach((prop)=>{
                    if(prop.ref) {
                        if(descriptors[prop.ref].single) {
                            requestServices[key][prop.name] = getSingleService(prop.ref);
                        } else {
                            requestServices[key][prop.name] = getRequestService(prop.ref, requestServices);
                        }
                    } else  {
                        requestServices[key][prop.name] = prop.value;
                    }
                });
            }
        });
        return getRequestService(id, requestServices);
    }

    /**
     * 设置服务描述
     * @param {string} id
     * @param {descriptor} descriptor
     */
    static setDescriptor(id, descriptor) {
        descriptor.single = descriptor.single === undefined ? true : descriptor.single;
        descriptors[id] = descriptor;
        singleServices[id] = getServiceSlot();
        if(!descriptor.single) {
            requestServiceKeys.push(id);
        }
    }

    /**
     * 启动
     */
    static startup(){
        let keys = Object.keys(descriptors);
        keys.forEach(key => {
            let descriptor = descriptors[key];
            if(descriptor.args && descriptor.args.length > 0) {
                let args = descriptor.args.map((arg) => arg.ref ? singleServices[arg.ref] : arg.value);
                singleServices[key][SLOT] = new descriptor.constructor(...args);
            } else {
                singleServices[key][SLOT] = new descriptor.constructor();
            }
        });

        keys.forEach(key => {
            singleServices[key] = getSingleService(key);
            let descriptor = descriptors[key];
            if(descriptor.args && descriptor.args.length > 0) {
                descriptor.args.forEach((arg)=>{
                    if(arg.ref) {
                        singleServices[key][arg.ref] = getSingleService(arg.ref);
                    }
                });
            }
            if(descriptor.props) {
                descriptor.props.forEach((prop)=>{
                    if(prop.ref) {
                        singleServices[key][prop.name] = getSingleService(prop.ref);
                    } else {
                        singleServices[key][prop.name] = prop.value;
                    }
                });
            }
        });
    }
}

module.exports = DI;

/**
 * 参数
 * @typedef arg
 * @property {*} value - 值
 * @property {string} ref - 引用
 */

/**
 * 属性
 * @typedef prop
 * @property {string} name - 名称
 * @property {*} value - 值
 * @property {string} ref - 引用
 */

/**
 * 服务描述
 * @typedef descriptor
 * @property {boolean} single - 是否单例
 * @property {Object} [constructor] - 构造函数
 * @property {arg[]} [args] - 构造函数参数
 * @property {prop[]} [props] - 属性
 */
