import { expect } from 'chai';
import 'mocha';

// Classes
import { AutoInstall } from '../../src/classes/autoinstall';

// Script
describe('1.0.0 > Auto Install', () => {
    it('Mocha sanity check', () => {
        expect(true).true;
    });

    it('Bootstrap database', async () => {
        return new AutoInstall().bootstrap();
    });

    it('Run autoinstall', async () => {
        return new AutoInstall().run();
    });
});
