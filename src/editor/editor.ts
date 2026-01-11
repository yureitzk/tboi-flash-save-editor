import type {
	Bosses,
	BossesKilled,
	Collections,
	Floors,
	FloorsCompleted,
	ItemsCollected,
	MiniBosses,
	MiniBossesKilled,
	Secrets,
	SecretsUnlocked,
	SettingsType,
} from './types.js';

import {
	encrypt,
	parseBossesKilledSubArray,
	parseFloorsCompletedSubArray,
	parseItemsCollectionSubArray,
	parseMiniBossesKilledSubArray,
	parseSecretsUnlockedArray,
} from '../utils/helpers.js';

export class SaveEditor {
	private encryptedSecretsData: string;
	private keyboardLayoutSettings: SettingsType;
	private leftyFlipSettings: SettingsType;
	private keyboardLayoutSettings2: SettingsType;
	private momKillsCount: number;
	private poopDestoyedCount: number;
	private donationMachineUsageCount: number;
	private deathCardUsageCount: number;
	private arcadeEntrancesCount: number;
	private bombsPlacedCount: number;
	private deathsCount: number;
	private rocksDestroyedCount: number;
	private xRocksDestoyedCount: number;
	private bossOfTheCathedralKillsCount: number;

	private itemsCollected: ItemsCollected[];
	private secretsUnlocked: SecretsUnlocked[];
	private bossesKilled: BossesKilled[];
	private miniBossesKilled: MiniBossesKilled[];
	private floorsCompleted: FloorsCompleted[];

	constructor() {
		this.encryptedSecretsData = '';
		this.keyboardLayoutSettings = '0';
		this.leftyFlipSettings = '0';
		this.keyboardLayoutSettings2 = '0';
		this.momKillsCount = 0;
		this.poopDestoyedCount = 0;
		this.donationMachineUsageCount = 0;
		this.deathCardUsageCount = 0;
		this.arcadeEntrancesCount = 0;
		this.bombsPlacedCount = 0;
		this.deathsCount = 0;
		this.rocksDestroyedCount = 0;
		this.xRocksDestoyedCount = 0;
		this.bossOfTheCathedralKillsCount = 0;
		this.itemsCollected = [];
		this.secretsUnlocked = [];
		this.bossesKilled = [];
		this.miniBossesKilled = [];
		this.floorsCompleted = [];
	}

	public parse(input: string): Record<string, string> {
		const result: Record<string, string> = {};

		const saveArray = input.split(',');

		while (saveArray.length < 18) {
			saveArray.push('');
		}

		this.encryptedSecretsData = saveArray[0] || '';
		this.keyboardLayoutSettings = this.#getSettingsValue(saveArray[1] || '');
		this.leftyFlipSettings = this.#getSettingsValue(saveArray[2] || '');
		this.keyboardLayoutSettings2 = this.#getSettingsValue(saveArray[3] || '');
		this.momKillsCount = parseInt(saveArray[4] || '0', 10);
		this.poopDestoyedCount = parseInt(saveArray[5] || '0', 10);
		this.donationMachineUsageCount = parseInt(saveArray[6] || '0', 10);
		this.deathCardUsageCount = parseInt(saveArray[7] || '0', 10);
		this.arcadeEntrancesCount = parseInt(saveArray[8] || '0', 10);
		this.bombsPlacedCount = parseInt(saveArray[9] || '0', 10);
		this.deathsCount = parseInt(saveArray[10] || '0', 10);
		this.rocksDestroyedCount = parseInt(saveArray[11] || '0', 10);
		this.xRocksDestoyedCount = parseInt(saveArray[16] || '0', 10);
		this.bossOfTheCathedralKillsCount = parseInt(saveArray[17] || '0', 10);

		this.itemsCollected = saveArray[12]
			? parseItemsCollectionSubArray(saveArray[12])
			: [];
		this.bossesKilled = saveArray[13]
			? parseBossesKilledSubArray(saveArray[13])
			: [];
		this.floorsCompleted = saveArray[14]
			? parseFloorsCompletedSubArray(saveArray[14])
			: [];
		this.miniBossesKilled = saveArray[15]
			? parseMiniBossesKilledSubArray(saveArray[15])
			: [];
		this.secretsUnlocked = parseSecretsUnlockedArray(this.encryptedSecretsData);

		return result;
	}

	#getSettingsValue(settings: string): SettingsType {
		if (settings !== 'true' && settings !== '0') {
			return '0';
		}
		return settings;
	}

	public getKeyboardLayoutSettings(): SettingsType {
		return this.keyboardLayoutSettings;
	}

	public setKeyboardLayoutSettings(keyboardLayoutSettings: SettingsType): void {
		this.keyboardLayoutSettings = keyboardLayoutSettings;
	}

	public getLeftyFlipSettings(): SettingsType {
		return this.leftyFlipSettings;
	}

	public setLeftyFlipSettings(leftyFlipSettings: SettingsType): void {
		this.leftyFlipSettings = leftyFlipSettings;
	}

	public getKeyboardLayoutSettings2(): SettingsType {
		return this.keyboardLayoutSettings2;
	}

	public setKeyboardLayoutSettings2(
		keyboardLayoutSettings2: SettingsType,
	): void {
		this.keyboardLayoutSettings2 = keyboardLayoutSettings2;
	}

	public getMomKillsCount(): number {
		return this.momKillsCount;
	}

	public setMomKillsCount(momKillsCount: number): void {
		this.momKillsCount = momKillsCount;
	}

	public getPoopDestoyedCount(): number {
		return this.poopDestoyedCount;
	}

	public setPoopDestoyedCount(poopDestoyedCount: number): void {
		this.poopDestoyedCount = poopDestoyedCount;
	}

	public getDonationMachineUsageCount(): number {
		return this.donationMachineUsageCount;
	}

	public setDonationMachineUsageCount(donationMachineUsageCount: number): void {
		this.donationMachineUsageCount = donationMachineUsageCount;
	}

	public getDeathCardUsageCount(): number {
		return this.deathCardUsageCount;
	}

	public setDeathCardUsageCount(deathCardUsageCount: number): void {
		this.deathCardUsageCount = deathCardUsageCount;
	}

	public getArcadeEntrancesCount(): number {
		return this.arcadeEntrancesCount;
	}

	public setArcadeEntrancesCount(arcadeEntrancesCount: number): void {
		this.arcadeEntrancesCount = arcadeEntrancesCount;
	}

	public getBombsPlacedCount(): number {
		return this.bombsPlacedCount;
	}

	public setBombsPlacedCount(bombsPlacedCount: number): void {
		this.bombsPlacedCount = bombsPlacedCount;
	}

	public getDeathsCount(): number {
		return this.deathsCount;
	}

	public setDeathsCount(deathsCount: number): void {
		this.deathsCount = deathsCount;
	}

	public getRocksDestroyedCount(): number {
		return this.rocksDestroyedCount;
	}

	public setRocksDestroyedCount(rocksDestroyedCount: number): void {
		this.rocksDestroyedCount = rocksDestroyedCount;
	}

	public getXRocksDestoyedCount(): number {
		return this.xRocksDestoyedCount;
	}

	public setXRocksDestoyedCount(xRocksDestoyedCount: number): void {
		this.xRocksDestoyedCount = xRocksDestoyedCount;
	}

	public getBossOfTheCathedralKillsCount(): number {
		return this.bossOfTheCathedralKillsCount;
	}

	public setBossOfTheCathedralKillsCount(
		bossOfTheCathedralKillsCount: number,
	): void {
		this.bossOfTheCathedralKillsCount = bossOfTheCathedralKillsCount;
	}

	public getItemsCollected(): ItemsCollected[] {
		return this.itemsCollected;
	}

	public unlockItem(itemName: Collections): boolean {
		const index = this.itemsCollected.findIndex((item) => item.name === itemName);

		if (index !== -1) {
			this.itemsCollected[index].unlocked = true;
			return true;
		} else {
			return false;
		}
	}

	public lockItem(itemName: Collections): boolean {
		const index = this.itemsCollected.findIndex((item) => item.name === itemName);

		if (index !== -1) {
			this.itemsCollected[index].unlocked = false;
			return true;
		} else {
			return false;
		}
	}

	public getSecretsUnlocked(): SecretsUnlocked[] {
		return this.secretsUnlocked;
	}

	public unlockSecret(secretName: Secrets): boolean {
		const index = this.secretsUnlocked.findIndex(
			(item) => item.name === secretName,
		);

		if (index !== -1) {
			this.secretsUnlocked[index].unlocked = true;
			return true;
		} else {
			return false;
		}
	}

	public lockSecret(secretName: Secrets): boolean {
		const index = this.secretsUnlocked.findIndex(
			(item) => item.name === secretName,
		);

		if (index !== -1) {
			this.secretsUnlocked[index].unlocked = false;
			return true;
		} else {
			return false;
		}
	}

	public getBossesKilled(): BossesKilled[] {
		return this.bossesKilled;
	}

	public updateBossKillCount(bossName: Bosses, newCount: number): boolean {
		const index = this.bossesKilled.findIndex((boss) => boss.name === bossName);

		if (index !== -1) {
			this.bossesKilled[index].count = newCount;
			return true;
		} else {
			return false;
		}
	}

	public getMiniBossesKilled(): MiniBossesKilled[] {
		return this.miniBossesKilled;
	}

	public updateMiniBossKillCount(
		miniBossName: MiniBosses,
		newCount: number,
	): boolean {
		const index = this.miniBossesKilled.findIndex(
			(miniBoss) => miniBoss.name === miniBossName,
		);

		if (index !== -1) {
			this.miniBossesKilled[index].count = newCount;
			return true;
		} else {
			return false;
		}
	}

	public getFloorsCompleted(): FloorsCompleted[] {
		return this.floorsCompleted;
	}

	public updateFloorsCompletedCount(
		floorName: Floors,
		newCount: number,
	): boolean {
		const index = this.floorsCompleted.findIndex(
			(floor) => floor.name === floorName,
		);

		if (index !== -1) {
			this.floorsCompleted[index].count = newCount;
			return true;
		} else {
			return false;
		}
	}

	public toString(): string {
		const encryptedSecrets = encrypt(this.secretsUnlocked);
		const itemsCollected = this.itemsCollected.map((itemCollected) =>
			itemCollected.unlocked ? '1' : '0',
		);
		itemsCollected.unshift('0');

		const bossesKilled = this.bossesKilled.map((bossKilled) => bossKilled.count);
		bossesKilled.unshift(0);

		const floorsCompleted = this.floorsCompleted.map(
			(floorCompleted) => floorCompleted.count,
		);
		floorsCompleted.unshift(0);

		const miniBossesKilled = this.miniBossesKilled.map(
			(miniBossKilled) => miniBossKilled.count,
		);

		const saveString = [
			encryptedSecrets,
			this.keyboardLayoutSettings,
			this.leftyFlipSettings,
			this.keyboardLayoutSettings2,
			this.momKillsCount,
			this.poopDestoyedCount,
			this.donationMachineUsageCount,
			this.deathCardUsageCount,
			this.arcadeEntrancesCount,
			this.bombsPlacedCount,
			this.deathsCount,
			this.rocksDestroyedCount,
			itemsCollected.join("'"),
			bossesKilled.join("'"),
			floorsCompleted.join("'"),
			miniBossesKilled.join("'"),
			this.xRocksDestoyedCount,
			this.bossOfTheCathedralKillsCount,
		];

		return saveString.join(',');
	}
}
