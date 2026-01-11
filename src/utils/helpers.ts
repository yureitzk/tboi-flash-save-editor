import fs from 'fs';
import type {
	BossesKilled,
	FloorsCompleted,
	ItemsCollected,
	MiniBossesKilled,
	Secrets,
	SecretsUnlocked,
} from '../editor/types.js';

import {
	bossesNamesArray,
	floorsNamesArray,
	itemsNamesArray,
	miniBossesNamesArray,
	secretsNamesArray,
} from '../consts/names.js';

export function parseItemsCollectionSubArray(
	subArrayString: string,
): ItemsCollected[] {
	const itemsArray = itemsNamesArray;

	const subArray = parseStringSubArray(subArrayString, itemsArray);

	const itemCollectionSubArray: ItemsCollected[] = subArray.map(
		(itemCollected, index) => {
			return {
				name: itemsArray[index],
				unlocked: itemCollected === '1',
			};
		},
	);

	return itemCollectionSubArray;
}

export function parseBossesKilledSubArray(
	subArrayString: string,
): BossesKilled[] {
	const bossesArray = bossesNamesArray;

	const subArray = parseNumberSubArray(subArrayString, bossesArray);

	const bossesKilledSubArray: BossesKilled[] = subArray.map(
		(bossKilled, index) => {
			return {
				name: bossesArray[index],
				count: bossKilled,
			};
		},
	);

	return bossesKilledSubArray;
}

export function parseFloorsCompletedSubArray(
	subArrayString: string,
): FloorsCompleted[] {
	const floorsArray = floorsNamesArray;

	const subArray = parseNumberSubArray(subArrayString, floorsArray);

	const floorsCompletedSubArray: FloorsCompleted[] = subArray.map(
		(floorCompleted, index) => {
			return {
				name: floorsArray[index],
				count: floorCompleted,
			};
		},
	);

	return floorsCompletedSubArray;
}

export function parseSecretsUnlockedArray(
	encryptedData: string,
): SecretsUnlocked[] {
	const secretsArray = secretsNamesArray;
	const secretsUnlockedArray = decrypt(encryptedData, secretsArray);

	return secretsUnlockedArray;
}

export function parseMiniBossesKilledSubArray(
	subArrayString: string,
): MiniBossesKilled[] {
	const miniBossesArray = miniBossesNamesArray;

	const subArray = parseNumberSubArray(subArrayString, miniBossesArray);

	const miniBossesKilledSubArray: MiniBossesKilled[] = subArray.map(
		(miniBossKilled, index) => {
			return {
				name: miniBossesArray[index],
				count: miniBossKilled,
			};
		},
	);

	return miniBossesKilledSubArray;
}

export function initializeChecker(): number[] {
	const checker: number[] = new Array(400).fill(0);
	let f1 = 5;
	let f2 = 6;
	let e = 0;

	while (e < 400) {
		checker[e] = 0;
		++e;
	}

	e = 0;
	while (e < 1000) {
		f1 += f2;
		++f2;
		if (f2 > 5) {
			f2 = 2;
		}
		if (f1 >= 200) {
			f1 -= 200;
		}
		checker[f1] += e % 5;
		if (checker[f1] >= 9) {
			checker[f1] -= 9;
		}
		checker[f1 + 201] = checker[f1];
		e++;
	}

	return checker;
}

export function decrypt(
	encryptedData: string,
	secretsCheckArray: Secrets[],
): SecretsUnlocked[] {
	const checker1: string[] = encryptedData.split('');
	const locker: SecretsUnlocked[] = [];
	const checker: number[] = initializeChecker();

	// Initialize locker
	for (let e = 0; e < secretsCheckArray.length; e++) {
		locker.push({
			name: secretsCheckArray[e],
			unlocked: false,
		});
	}

	// Perform decryption
	for (let e = 1; e <= secretsCheckArray.length; e++) {
		const f1 = e * 2 + 11;

		if (f1 < checker1.length && f1 < 400) {
			const encryptedValue = parseInt(checker1[f1], 10);

			if (!isNaN(encryptedValue)) {
				const originalCheckerValue = checker[f1];
				let encryptedCheckerValue = originalCheckerValue + (e % 4) + 1;
				if (encryptedCheckerValue > 9) {
					encryptedCheckerValue -= 9;
				}

				if (encryptedValue === encryptedCheckerValue) {
					locker[e - 1].unlocked = true;
				}
			}
		}
	}

	return locker;
}

export function encrypt(locker: SecretsUnlocked[]): string {
	const checker = initializeChecker();
	const checker1 = new Array(400);

	// Copy the checker array
	for (let e = 0; e <= 400; e++) {
		checker1[e] = checker[e];
	}

	// Apply locker modifications
	for (let e = 1; e <= locker.length; e++) {
		if (locker[e - 1].unlocked === true) {
			const f1 = e * 2 + 11;
			if (f1 < 400) {
				checker1[f1] += (e % 4) + 1;
				if (checker1[f1] > 9) {
					checker1[f1] -= 9;
				}
			}
		}
	}

	// Convert to string
	let encryptedData = '';
	for (let e = 0; e < 400; e++) {
		encryptedData += checker1[e];
	}

	return encryptedData;
}

function parseStringSubArray(
	subArrayString: string,
	checkArray: string[],
): string[] {
	if (subArrayString !== '' && subArrayString !== '0') {
		// eslint-disable-next-line prefer-const
		let firstPart = subArrayString.split("'");
		firstPart.shift();
		const array = firstPart ? firstPart : [];

		while (array.length < checkArray.length) {
			array.push('0');
		}

		return array;
	}
	return Array(checkArray.length).fill('0');
}

export function parseNumberSubArray(
	subArrayString: string,
	checkArray: string[],
): number[] {
	if (subArrayString !== '' && subArrayString !== '0') {
		const firstArray = subArrayString.split("'");
		firstArray.shift();

		const firstPart = firstArray ?? [];
		let array = firstPart.map((item) => parseInt(item, 10));

		if (array.length > checkArray.length) {
			array = array.slice(0, checkArray.length);
		} else {
			while (array.length < checkArray.length) {
				array.push(0);
			}
		}

		return array;
	}
	return Array(checkArray.length).fill(0);
}

export async function readFileAsync(filePath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

export async function writeFileAsync(
	filePath: string,
	data: string,
): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, data, 'utf8', (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
