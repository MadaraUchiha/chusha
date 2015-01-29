import should from 'should';
import {Chusha} from '../src/chusha';
import {Level0, Level1_1, Level1_2, Level2} from './fixtures/dependencies';
import {InjectableParam, ExtraParams} from './fixtures/extraParams';

describe('Chusha Dependency Injector', () => {
    it('should resolve dependencies recursively', () => {
        let fixture = Chusha.get(Level0);
        let [one, two, three] = fixture.dependencies;
        one.should.be.instanceOf(Level1_1);
        two.should.be.instanceOf(Level1_2);
        three.should.be.instanceOf(Level2);
    });

    it('should take shared object', () => {
        Chusha.share({test: 123}, 'Level2');
        let fixture = Chusha.get(Level0);
        let [,,three] = fixture.dependencies;
        (three.test).should.equal(123);

        //Clean up
        Chusha.unshare('Level2');
    });

    it('should throw when trying to share same hash twice', () => {
        let hash = 'test';
        (function shareSameHash() {
            Chusha.share({}, hash);
            Chusha.share({}, hash);
        }).should.throw(`Cannot share object because object named ${hash} already exists. Please use Chusha.prototype.unshare to drop the current one first.`);
    });

    it('should throw when trying to share primitive', () => {
        let err = 'Cannot share plain objects or primitives.';
        (() => { Chusha.share(42); }).should.throw(err);
        (() => { Chusha.share('string'); }).should.throw(err);
        (() => { Chusha.share(['array']); }).should.throw(err);
        (() => { Chusha.share({'object': 'object'}); }).should.throw(err);
    });

    it('should pass params on to the constructor', () => {
        let other = Chusha.get(InjectableParam, 1);
        Chusha.share(other);

        let logger = Chusha.get(ExtraParams, 2, 3);

        (logger.foo).should.equal(1);
        (logger.a).should.equal(2);
        (logger.b).should.equal(3);
    });
});

