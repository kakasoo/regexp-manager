import { RegExpBuilder } from '../../regexp-builder';

describe('example of using include method', () => {
    // TODO : need to be implemented AND statment, OR statement

    //     it('make regexp to validate email', async () => {
    //         new RegExpBuilder('[a-z]')
    //     });

    it('get only protocol such as "https"', () => {
        const regExp = new RegExpBuilder().from('https').include('://', { isForehead: false }).getOne();
        const protocol = 'https://www.kakasoo.com/'.match(regExp)?.at(0);

        expect(protocol).toBe('https');
    });

    it('string after [0-9]+', () => {
        const includeRegExp = new RegExpBuilder().from('mouse').include('[0-9]+').getOne();

        const res = '12345mouse'.match(includeRegExp)?.at(0);
        expect(res).toBe('mouse');
    });

    it('check if url include "https://"', () => {
        const regexp = new RegExpBuilder().include('https://', { isForehead: true }).getOne();

        expect(regexp.test('www.kakasoo.com')).toBe(false);
        expect(regexp.test('https://www.kakasoo.com')).toBe(true);
    });

    it('url have to match string without host', () => {
        const regexp = new RegExpBuilder('.+').include('https://', { isForehead: true }).getOne();

        const urlWithoutProtocol = 'https://www.kakasoo.com'.match(regexp)?.at(0);
        expect(urlWithoutProtocol).toBe('www.kakasoo.com');
    });
});
