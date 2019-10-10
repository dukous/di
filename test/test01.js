
const assert = require('assert');

const {
    DI
} = require('../');

describe('test01', function () {

    it('String', function () {

        DI.setDescriptor('a', {
            constructor: String,
            args: [
                { value: '123' }
            ]
        });

        DI.startup();

        console.log(DI.getService('a'));
        assert.ok(DI.getService('a').toString() === '123');
    });

    it('Number', function () {

        DI.setDescriptor('b', {
            constructor: Number,
            args: [
                { value: 1}
            ]
        });

        DI.startup();

        console.log(DI.getService('b'));
        assert.ok(DI.getService('b').valueOf() === 1);
    });

    it('Array', function () {

        /**
         * 如果类型不是自己维护的代码不要使用{ref='xxx'}
         */
        DI.setDescriptor('a', {
            constructor: String,
            args: [
                { value: '123'}
            ]
        });

        DI.setDescriptor('c', {
            constructor: Array,
            args: [
                { value: 1},
                { value: 2},
                { value: 'a'}
            ]
        });

        DI.startup();

        console.log(DI.getService('c'));
        assert.ok(DI.getService('c')[2] === 'a');
    });

});
