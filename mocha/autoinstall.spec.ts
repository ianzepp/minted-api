import { expect } from 'chai';
import 'mocha';

// Classes
import { AutoInstall } from '../src/classes/autoinstall';

// Script
describe('Autoinstall', () => {
    it('Mocha sanity check', () => {
        expect(true).true;
    });

    it('Bootstrap database', async () => {
        return new AutoInstall().bootstrap();
    });

    it('Install core schemas', async () => {
        return new AutoInstall().run();
    });
});
