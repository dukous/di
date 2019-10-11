
const SLOT = '__slot__';

/**
 * 描述存储
 */
let descriptorStore = {};

/**
 * 单例服务存储
 */
let singleServiceStore = {};

/**
 * 获取服务
 * @param id
 * @param serviceStore
 * @return {*}
 */
function getService(id, serviceStore) {
    if(serviceStore[id] && serviceStore[id][SLOT])
        return serviceStore[id][SLOT];
    return serviceStore[id];
}

/**
 * 创建服务槽
 */
function createServiceSlot() {
    return { [SLOT]: null };
}

/**
 * 设置服务槽
 * @param id
 * @param serviceStore
 */
function setServiceSlot(id, serviceStore) {
    serviceStore[id][SLOT] = createService(descriptorStore[id], serviceStore);
}

/**
 * 移除服务槽
 * @param id
 * @param serviceStore
 */
function removeServiceSlot(id, serviceStore) {
    serviceStore[id] = getService(id, serviceStore);
    let descriptor = descriptorStore[id];
    if(descriptor.args && descriptor.args.length > 0) {
        descriptor.args.forEach((arg) => {
            if(arg.ref) {
                serviceStore[id][arg.ref] = getService(arg.ref, serviceStore);
            }
        });
    }
    if(descriptor.props) {
        descriptor.props.forEach((prop)=>{
            serviceStore[id][prop.name] = prop.ref ? getService(prop.ref, serviceStore) : prop.value;
        });
    }
}

/**
 * 获取依赖Ids
 * @param {string} rootId - 根ID
 * @param {string} currentId - 当前ID
 * @param {Object} [idStore] - ID存储
 * @return {string[]}
 */
function dependentIds(rootId, currentId, idStore) {
    idStore = idStore ? idStore : { __ids__: [] };
    if(idStore[currentId]) {
        return idStore.__ids__;
    }
    let descriptor = descriptorStore[currentId];
    if(descriptor) {
        idStore[currentId] = 'start';
        idStore.__ids__.push(currentId);
        if(descriptor.args)
            descriptor.args.forEach(arg => {
                if(arg.ref) dependentIds(rootId, arg.ref, idStore);
            });
        if(descriptor.props)
            descriptor.props.forEach(prop => {
                if(prop.ref) dependentIds(rootId, prop.ref, idStore);
            });
        idStore[currentId] = 'end';
    }
    let ids = idStore.__ids__;
    if(rootId === currentId) {
        idStore = null;
    }
    return ids;
}

/**
 * 创建服务
 * @param {descriptor} descriptor - 描述
 * @param {Object} serviceStore - 服务存储
 * @return {*}
 */
function createService(descriptor, serviceStore) {
    if(descriptor.args && descriptor.args.length > 0) {
        let args = descriptor.args.map((arg) => arg.ref ? serviceStore[arg.ref] : arg.value);
        return new descriptor.constructor(...args);
    } else {
        return new descriptor.constructor();
    }
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
        let descriptor = descriptorStore[id];
        if(descriptor) {
            if(descriptor.single)
                return getService(id, singleServiceStore);

            let requestServiceStore = {};
            let ids = dependentIds(id, id);
            ids.forEach(id => {
                requestServiceStore[id] = createServiceSlot();
            });
            ids.forEach(id => {
                let descriptor = descriptorStore[id];
                if(descriptor.single) {
                    requestServiceStore[id] = getService(id, singleServiceStore);
                } else {
                    setServiceSlot(id, requestServiceStore);
                }
            });
            ids.forEach(id => {
                removeServiceSlot(id, requestServiceStore);
            });
            let service = getService(id, requestServiceStore);
            requestServiceStore = null;
            return service;
        }
        return null;
    }

    /**
     * 设置服务描述
     * @param {string} id
     * @param {descriptor} descriptor - 描述
     */
    static setDescriptor(id, descriptor) {
        descriptor.single = descriptor.single === undefined ? true : descriptor.single;
        descriptorStore[id] = descriptor;
        singleServiceStore[id] = createServiceSlot();
    }

    /**
     * 启动
     */
    static startup(){
        let keys = Object.keys(descriptorStore);
        keys.forEach(id => {
            setServiceSlot(id, singleServiceStore);
        });
        keys.forEach(id => {
            removeServiceSlot(id, singleServiceStore);
        });
    }

    /**
     *
     * @param {string} rootId - 根ID
     * @return {string[]}
     */
    static dependentIds(rootId) {
        return dependentIds(rootId, rootId);
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
 * @property {Function} [constructor] - 构造函数
 * @property {arg[]} [args] - 构造函数参数
 * @property {prop[]} [props] - 属性
 */
