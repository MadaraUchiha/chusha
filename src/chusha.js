let sharePool = {};

export class Chusha {
    constructor() {
        this.sharePool = {};
    }

    static get(Constructor) {
        if (Constructor.constructor.name === 'Object') {
            // You passed an already instantiated object and not a constructor.
            // Inject it directly.
            return Constructor;
        }
        if (sharePool[Constructor] || sharePool[Constructor.name]) {
            return sharePool[Constructor.name];
        }
        let dependencyConstructors = Constructor.inject ? (Constructor.inject() || []) : [];
        let dependencies = dependencyConstructors.map(el => Chusha.get(el));
        let obj = Object.create(Constructor.prototype);
        Constructor.apply(obj, dependencies);

        return obj;
    }

    static share(obj, hash = obj.constructor.name) {
        let illegalConstructors = ['Number', 'Boolean', 'String', 'Array', 'Function'];
        if (sharePool[hash]) {
            throw new Error('Cannot share object because object named ' + hash + ' already exists. Please use Chusha.prototype.unshare to drop the current one first.');
        }
        if (illegalConstructors.includes(hash)) {
            throw new Error('Cannot share plain objects or primitives.');
        }
        this.sharePool[hash] = obj;
    }

    static unshare(hash) {
        this.sharePool[hash] = null;
    }
}

if (window) {
    window.Chusha = Chusha;
}