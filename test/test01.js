
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

    it('dependentIds', function () {

        class A {
            constructor(b, e) {
                this.b = b;
                this.e = e;
            }
        }

        class B {
            constructor(a, f) {
                this.a = a;
                this.f = f;
            }
        }

        class C {
            constructor(d) {
                this.d = d;
            }
        }

        class D {
            constructor(b) {
                this.b = b;
            }
        }

        class E {
            constructor(b) {
                this.b = b;
            }
        }

        class F {
            constructor(c) {
                this.c = c;
            }
        }

        DI.setDescriptor('a', {
            constructor: A,
            single: false,
            args:[
                { ref: 'b' },
                { ref: 'e' }
            ],
            props:[
                { name: 'bb', ref: 'b' }
            ]
        });

        DI.setDescriptor('b', {
            constructor: B,
            args:[
                { ref: 'a' },
                { ref: 'f' }
            ]
        });

        DI.setDescriptor('c', {
            constructor: C,
            args:[
                { ref: 'd' }
            ]
        });

        DI.setDescriptor('d', {
            constructor: D,
            single: false,
            args:[
                { value: 'b' }
            ]
        });

        DI.setDescriptor('e', {
            constructor: E,
            args:[
                { ref: 'b' }
            ]
        });

        DI.setDescriptor('f', {
            constructor: F,
            single: false,
            args:[
                { ref: 'c' }
            ]
        });

        DI.startup();
        console.log(DI.dependentIds('a'));
        console.log(DI.dependentIds('b'));
        console.log(DI.dependentIds('c'));
        console.log(DI.dependentIds('d'));
        console.log(DI.dependentIds('e'));
        console.log(DI.dependentIds('f'));

        console.info(DI.getService('a'));
        console.info(DI.getService('b'));
        console.info(DI.getService('c'));
        console.info(DI.getService('d'));
        console.info(DI.getService('e'));
        console.info(DI.getService('f'));
    });

});
