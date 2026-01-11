import { SaveEditor } from '../src/index';

describe('SaveEditor', () => {
	let instance: SaveEditor;

	beforeEach(() => {
		instance = new SaveEditor();
	});

	test('Should correctly parse the input string', () => {
		const input = `83684833638802420754210144041532026104173768625528346166366505626334688603497566830141065729094307143101640316336660342707696135688461423764810848735388074503162307400211386760521435666033240368683264,0,0,0,57,4709,98,15,128,3203,420,18416,0'1'1'1'1'1'1'1'1'0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'1'0'0'1'1'0'1'1'1'1'1'1'1'1'1'1'1'0'1'1'0'1'1'1'1'1'1'1'1'1'0'1'1'0'0'1'1'1'0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'0'0'1'1'1'0'1'0'0'0'1'0'1'1'1'1'1'1'1'1'1'1'1'0'1'0'0'1'1'1'1'1'1'1'1'1,0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'1'1'1'1'1'1'1'0'1'1'1'1,0'359'301'177'184'100'70'45'44'17,1'1'1'1'1'1'1'0'0'0,176,9`;

		instance.parse(input);

		expect(instance.getKeyboardLayoutSettings()).toBeDefined();
		expect(instance.getLeftyFlipSettings()).toBeDefined();
		expect(instance.getKeyboardLayoutSettings2()).toBeDefined();
		expect(instance.getMomKillsCount()).toBe(57);
		expect(instance.getPoopDestoyedCount()).toBe(4709);
		expect(instance.getDonationMachineUsageCount()).toBe(98);
		expect(instance.getDeathsCount()).toBe(420);
		expect(instance.getArcadeEntrancesCount()).toBe(128);
		expect(instance.getBombsPlacedCount()).toBe(3203);
		expect(instance.getDeathsCount()).toBe(420);
		expect(instance.getRocksDestroyedCount()).toBe(18416);
		expect(instance.getXRocksDestoyedCount()).toBe(176);
		expect(instance.getBossOfTheCathedralKillsCount()).toBe(9);
		expect(instance.getItemsCollected()).toBeDefined();
		expect(instance.getBossesKilled()).toBeDefined();
		expect(instance.getFloorsCompleted()).toBeDefined();
		expect(instance.getMiniBossesKilled()).toBeDefined();
		expect(instance.getSecretsUnlocked()).toBeDefined();
	});

	test('Should handle missing values', () => {
		const input = 'encryptedData,layout1,,,,,,,50,,,,,,120';

		instance.parse(input);

		expect(instance.getMomKillsCount()).toBe(0);
		expect(instance.getPoopDestoyedCount()).toBe(0);
		expect(instance.getDeathCardUsageCount()).toBe(0);
		expect(instance.getArcadeEntrancesCount()).toBe(50);
		expect(instance.getItemsCollected()).toEqual([]);
		expect(instance.getBossesKilled()).toEqual([]);
	});

	test('Should handle empty input safely', () => {
		instance.parse('');

		expect(instance.getMomKillsCount()).toBe(0);
		expect(instance.getPoopDestoyedCount()).toBe(0);
		expect(instance.getDeathsCount()).toBe(0);
		expect(instance.getItemsCollected()).toEqual([]);
	});

	test('Should handle extra commas and ignore additional values', () => {
		const input = `83684833638802420754210144041532026104173768625528346166366505626334688603497566830141065729094307143101640316336660342707696135688461423764810848735388074503162307400211386760521435666033240368683264,0,0,0,57,4709,98,15,128,3203,420,18416,0'1'1'1'1'1'1'1'1'0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'1'0'0'1'1'0'1'1'1'1'1'1'1'1'1'1'1'0'1'1'0'1'1'1'1'1'1'1'1'1'0'1'1'0'0'1'1'1'0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'0'0'1'1'1'0'1'0'0'0'1'0'1'1'1'1'1'1'1'1'1'1'1'0'1'0'0'1'1'1'1'1'1'1'1'1,0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'0'1'1'1'1'1'1'1'0'1'1'1'1,0'359'301'177'184'100'70'45'44'17,1'1'1'1'1'1'1'0'0'0,176,9,EXTRA,EXTRA`;

		instance.parse(input);

		expect(instance.getMomKillsCount()).toBe(57);
		expect(instance.getXRocksDestoyedCount()).toBe(176);
	});

	test('Should handle missing values due to too few commas', () => {
		const input =
			'8368483363880048035328074003133807600214336760522433686332640368683366830848736388004803532807400313380760021433666032240368683264836848336388084873538807450313280740021138676052143366603224036868326408368483363880048035328074003133807600214336760522433686332640368683366830848736388004803532807400313380760021433666032240368683264836848336388084873538807450313280740021138686052143366603224036868326,0,,0,30,20';

		instance.parse(input);

		expect(instance.getMomKillsCount()).toBe(30);
		expect(instance.getPoopDestoyedCount()).toBe(20);
		expect(instance.getDeathsCount()).toBe(0);
		expect(instance.getXRocksDestoyedCount()).toBe(0);
		expect(instance.getItemsCollected()).toEqual([]);
	});
});
