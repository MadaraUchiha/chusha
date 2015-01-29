export class InjectableParam {
    constructor(foo) {
        this.foo = foo;
    }
}

export class ExtraParams {
    static inject() { return [InjectableParam]; }
    constructor(other, a, b) {
        this.foo = other.foo;
        this.a = a;
        this.b = b;
    }
}