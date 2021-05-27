import {AhoQ} from '../src/ahoq.js';

describe('AhoQ', () => {

	it('Should create the instance', () => {
		const ahoq = new AhoQ(['ab', 'aa', 'bc', 'abc', 'aaa', 'aab']);
	});

	let ahoq;

	describe('There is a AhoQ instance', () => {

		beforeEach(() => {
			ahoq = new AhoQ();
		});

		it('should find nothing in text `asd`', () => {
			expect(ahoq.find('asd').length).toBe(0);
		});

		describe('6 strings added to the AhoQ collection', () => {

			beforeEach(() => {
				ahoq.add(['ab', 'aa', 'bc', 'abc', 'aaa', 'aab']);
			});

			it('should find 9 matches in text `aabbcaabc`', () => {
				const res = ahoq.find('aabbcaabc');

				const shouldContains = [
					{index:0, pattern: 'aa'},
					{index:0, pattern: 'aab'},
					{index:1, pattern: 'ab'},
					{index:3, pattern: 'bc'},
					{index:5, pattern: 'aa'},
					{index:5, pattern: 'aab'},
					{index:6, pattern: 'ab'},
					{index:6, pattern: 'abc'},
					{index:7, pattern: 'bc'}
				];

				expect(res.length).toBe(9);

				for(let o of shouldContains) {
					expect(res).toContain(jasmine.objectContaining(o));
				}
			});

			it('should show each step when report mode is STEP', () => {
				const s = ahoq.search('aabbcaabc', {report: AhoQ.REPORT.STEP});
				let pos = 0;
				for(const it of s) {
					expect(s.getPos()).toBe(++pos);
				}
			});

			it('should find nothing', () => {
				const res = ahoq.find('zcxzckcllasjclzx');

				expect(res.length).toBe(0);
			});

			describe('remove 4 strings', () => {
				beforeEach(() => {
					ahoq.remove(['ab', 'bc', 'aaa', 'aa']);
				});

				it('should find 2 matches in text `asdasabcsdaabbbasd`', () => {
					const shouldContain = [
						{index: 5, pattern: 'abc'},
						{index: 10, pattern: 'aab'}
					];

					const res = ahoq.find('asdasabcsdaabbbasd');

					expect(res.length).toBe(2);

					for(let o of shouldContain) {
						expect(res).toContain(jasmine.objectContaining(o));
					}
				});
			});
		});

		describe('adding incorrect inputs', () => {
			it('should throw an error', () => {
				expect(() => { ahoq.add({}); }).toThrow();
			});
		});

		describe('2 strings added to the AhoQ collection', () => {
			beforeEach(() => {
				ahoq.add(['abbb', 'bb']);
			});

			it('should find 4 matches in text `gfgfgabbbaadsdbb`',() => {
				const shouldContain = [
					{index: 5, pattern: 'abbb'},
					{index: 6, pattern: 'bb'},
					{index: 7, pattern: 'bb'},
					{index: 14, pattern: 'bb'}
				];

				const res = ahoq.find('gfgfgabbbaadsdbb');

				expect(res.length).toBe(4);

				for(let o of shouldContain) {
					expect(res).toContain(jasmine.objectContaining(o));
				}
			});
		});
	});

});
