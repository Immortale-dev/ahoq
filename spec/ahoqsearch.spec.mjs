import {AhoQ} from '../src/ahoq.js';

describe('AhoQ', () => {

	let ahoq;

	describe('There is a AhoQ instance', () => {

		beforeEach(() => {
			ahoq = new AhoQ();
		});

		describe('6 strings added to the AhoQ collection', () => {

			beforeEach(() => {
				ahoq.add(['ab', 'aa', 'bc', 'abc', 'aaa', 'aab']);
			});

			it('setPos should move pos to the right position', () => {
				const s = ahoq.search('xxxxxaaxxxxxxaaxxxx', {report: AhoQ.REPORT.STEP});

				const res = [];
				let steps = 0;

				for(const it of s) {
					if(s.getPos() === 1) {
						s.setPos(13);
					}
					steps++;
					res.push(...it);
				}

				expect(res.length).toBe(1);
				expect(steps).toBe(7);
			});

			it('reset should clear current state', () => {
				const s = ahoq.search('xxxxxaaxxxx', {report: AhoQ.REPORT.STEP});

				const res = [];

				for(const it of s) {
					if(s.getPos() === 6){
						//reset state when first `a` is proceeded
						s.reset();
					}
					res.push(...it);
				}

				expect(res.length).toBe(0);
			});

			it('reload should work', () => {
				const s = ahoq.search('xxxxxaaxxxx', {report: AhoQ.REPORT.MATCH});

				[...s];
				s.reload();

				expect([...s].flat().length).toBe(1);
			});
		});
	});
});
