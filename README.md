# di
    class A {
        constructor(b) {
            this.id = Math.random();
            this.b = b;
        }
    }

    class B {
        constructor(c) {
            this.id = Math.random();
            this.c = c;
        }
    }

    class C {
        constructor(d) {
            this.id = Math.random();
            this.d = d;
        }
    }

    class D {
        constructor() {
            this.id = Math.random();
        }
    }
    
    DI.setDescriptor('a', {
        constructor: A,
        single: false,
        args:[
            { ref: 'b' }
        ]
    });

    DI.setDescriptor('b', {
        constructor: B,
        args:[
            { ref: 'c' }
        ]
    });

    DI.setDescriptor('c', {
        single: false,
        constructor: C,
        args:[
            { ref: 'd' }
        ]
    });

    DI.setDescriptor('d', {
        constructor: D
    });

    DI.startup();

    console.log('request', JSON.stringify(DI.getService('a')));
    console.log('request', JSON.stringify(DI.getService('a')));
    console.log('request', JSON.stringify(DI.getService('a')));
    console.log('---------------------------------');
    console.log('---------------------------------');
    console.log('single', JSON.stringify(DI.getService('b')));
    console.log('single', JSON.stringify(DI.getService('b')));
    console.log('single', JSON.stringify(DI.getService('b')));
    console.log('---------------------------------');
    console.log('---------------------------------');
    console.log('request', JSON.stringify(DI.getService('c')));
    console.log('request', JSON.stringify(DI.getService('c')));
    console.log('request', JSON.stringify(DI.getService('c')));
    console.log('---------------------------------');
    console.log('---------------------------------');
    console.log('single',JSON.stringify(DI.getService('d')));
    console.log('single',JSON.stringify(DI.getService('d')));
    console.log('single',JSON.stringify(DI.getService('d')));
    console.log('---------------------------------');
    console.log('---------------------------------');
    
    request {"id":0.20134020339458436,"b":{"id":0.050290256525654,"c":{"id":0.40589360312913003,"d":{"id":0.9785633325093757}}}}
    request {"id":0.616743642140972,"b":{"id":0.050290256525654,"c":{"id":0.9717748044041763,"d":{"id":0.9785633325093757}}}}
    request {"id":0.33289539411322266,"b":{"id":0.050290256525654,"c":{"id":0.479683526914471,"d":{"id":0.9785633325093757}}}}
    ---------------------------------
    ---------------------------------
    single {"id":0.050290256525654,"c":{"id":0.479683526914471,"d":{"id":0.9785633325093757}}}
    single {"id":0.050290256525654,"c":{"id":0.479683526914471,"d":{"id":0.9785633325093757}}}
    single {"id":0.050290256525654,"c":{"id":0.479683526914471,"d":{"id":0.9785633325093757}}}
    ---------------------------------
    ---------------------------------
    request {"id":0.08199799643186667,"d":{"id":0.9785633325093757}}
    request {"id":0.9138945099455842,"d":{"id":0.9785633325093757}}
    request {"id":0.21158628061111906,"d":{"id":0.9785633325093757}}
    ---------------------------------
    ---------------------------------
    single {"id":0.9785633325093757}
    single {"id":0.9785633325093757}
    single {"id":0.9785633325093757}
    
