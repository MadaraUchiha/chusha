let sharePool = {};

export class Chusha {
    constructor() {
        this.sharePool = {};
    }

    static get(Constructor, ...args) {
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
        let params = dependencies.concat(args);
        Constructor.apply(obj, params);

        return obj;
    }

    static share(obj, hash = obj.constructor.name) {
        let illegalConstructors = ['Number', 'Boolean', 'String', 'Array', 'Function', 'Object'];
        if (sharePool[hash]) {
            throw new Error(`Cannot share object because object named ${hash} already exists. Please use Chusha.prototype.unshare to drop the current one first.`);
        }
        if (illegalConstructors.includes(hash)) {
            throw new Error('Cannot share plain objects or primitives.');
        }
        sharePool[hash] = obj;
    }

    static unshare(hash) {
        sharePool[hash] = null;
    }
}

if (typeof(window) !== 'undefined') {
    window.Chusha = Chusha;
}
