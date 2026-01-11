#!/usr/bin/env node

import { createRequire } from 'node:module';
import { table } from 'console-table-without-index';
import { Command } from 'commander';
import { SaveEditor } from '../editor/editor.js';
import {
	bossesNamesArray,
	floorsNamesArray,
	itemsNamesArray,
	miniBossesNamesArray,
	secretsNamesArray,
} from '../consts/names.js';
import { readFileAsync, writeFileAsync } from '../utils/helpers.js';
import { Collections, Secrets } from '../editor/types.js';

const require = createRequire(import.meta.url);
const meta = require('../../package.json');

const program = new Command();
const saveEditor = new SaveEditor();

type PropertyDefinition = {
	name: string;
	setter: (value: number) => void;
};

type CountPropertyDefinition = {
	name: string;
	setter: (value: number) => void;
	getter: () => number;
};

type StatPropertyDefinition = {
	name: string;
	getter: () => unknown;
};

const statProperties: StatPropertyDefinition[] = [
	{
		name: 'Items Collected',
		getter: () => {
			return saveEditor.getItemsCollected();
		},
	},
	{
		name: 'Secrets Unlocked',
		getter: () => {
			return saveEditor.getSecretsUnlocked();
		},
	},
	{
		name: 'Bosses Killed',
		getter: () => {
			return saveEditor.getBossesKilled();
		},
	},
	{
		name: 'Mini Bosses Killed',
		getter: () => {
			return saveEditor.getMiniBossesKilled();
		},
	},
	{
		name: 'Floors Completed',
		getter: () => {
			return saveEditor.getFloorsCompleted();
		},
	},
];

const countProperties: CountPropertyDefinition[] = [
	{
		name: 'Mom Kills Count',
		setter: (value: number) => {
			saveEditor.setMomKillsCount(value);
		},
		getter: () => {
			return saveEditor.getMomKillsCount();
		},
	},
	{
		name: 'Poop Destroyed Count',
		setter: (value: number) => {
			saveEditor.setPoopDestoyedCount(value);
		},
		getter: () => {
			return saveEditor.getPoopDestoyedCount();
		},
	},
	{
		name: 'Donation Machine Usage Count',
		setter: (value: number) => {
			saveEditor.setDonationMachineUsageCount(value);
		},
		getter: () => {
			return saveEditor.getDonationMachineUsageCount();
		},
	},
	{
		name: 'Death Card Usage Count',
		setter: (value: number) => {
			saveEditor.setDeathCardUsageCount(value);
		},
		getter: () => {
			return saveEditor.getDeathCardUsageCount();
		},
	},
	{
		name: 'Arcade Entrances Count',
		setter: (value: number) => {
			saveEditor.setArcadeEntrancesCount(value);
		},
		getter: () => {
			return saveEditor.getArcadeEntrancesCount();
		},
	},
	{
		name: 'Bombs Placed Count',
		setter: (value: number) => {
			saveEditor.setBombsPlacedCount(value);
		},
		getter: () => {
			return saveEditor.getBombsPlacedCount();
		},
	},
	{
		name: 'Deaths Count',
		setter: (value: number) => {
			saveEditor.setDeathsCount(value);
		},
		getter: () => {
			return saveEditor.getDeathsCount();
		},
	},
	{
		name: 'Rocks Destroyed Count',
		setter: (value: number) => {
			saveEditor.setRocksDestroyedCount(value);
		},
		getter: () => {
			return saveEditor.getRocksDestroyedCount();
		},
	},
	{
		name: 'X Rocks Destroyed Count',
		setter: (value: number) => {
			saveEditor.setXRocksDestoyedCount(value);
		},
		getter: () => {
			return saveEditor.getXRocksDestoyedCount();
		},
	},
	{
		name: 'Boss of the Cathedral Kills Count',
		setter: (value: number) => {
			saveEditor.setBossOfTheCathedralKillsCount(value);
		},
		getter: () => {
			return saveEditor.getBossOfTheCathedralKillsCount();
		},
	},
];

function formatArray(str: object): string {
	return table(str);
}

function collect(value: string, previous: unknown): string[] {
	const previousArray = Array.isArray(previous) ? previous : [];
	return previousArray.concat([value]);
}

function handleCountOptions(
	options: string[],
	validItems: Map<string, PropertyDefinition>,
	optionName: string,
): void {
	const collectedWarnings: Array<{ option: string; message: string }> = [];

	for (const option of options) {
		const lastCommaIndex = option.lastIndexOf(',');

		if (lastCommaIndex === -1) {
			collectedWarnings.push({
				option,
				message: `invalid argument`,
			});
			continue;
		}

		const property = option.substring(0, lastCommaIndex);
		const value = option.substring(lastCommaIndex + 1);

		const itemDefinition = validItems.get(property);
		if (!itemDefinition) {
			collectedWarnings.push({
				option,
				message: `"${property}" (unknown stat for --${optionName})`,
			});
			continue;
		}

		if (value === '') {
			collectedWarnings.push({
				option,
				message: `"${property}" "${value}" (invalid count value for --${optionName}. Must be a non-negative integer.)`,
			});
		}

		const numericValue = Number(value);

		if (
			isNaN(numericValue) ||
			!Number.isInteger(numericValue) ||
			numericValue < 0
		) {
			collectedWarnings.push({
				option,
				message: `"${property}" "${value}" (invalid count value for --${optionName}. Must be a non-negative integer.)`,
			});
			continue;
		}

		try {
			itemDefinition.setter(numericValue);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Unknown error occurred';

			collectedWarnings.push({
				option,
				message: `Error setting "${itemDefinition.name}" for --${optionName}: ${errorMessage}`,
			});
		}
	}

	if (collectedWarnings.length > 0) {
		console.warn(
			`Warning: The following --${optionName} options were not processed due to invalid input:`,
		);
		for (const warning of collectedWarnings) {
			console.warn(`- "${warning.option}": ${warning.message}`);
		}
	}
}

function displayStats(): void {
	const stats = [...countProperties, ...statProperties];

	stats.forEach((stat) => {
		const values = stat.getter();

		if (Array.isArray(values)) {
			console.log(
				`${stat.name}:`,
				`\n${formatArray(values.filter((value) => value.name !== ''))}`, // filter empty mini-bosses
			);
		} else {
			console.log(`${stat.name}:`, values);
		}
	});
}

const statisticPropertyMap = new Map<string, PropertyDefinition>();
countProperties.forEach((p) => statisticPropertyMap.set(p.name, p));

const bossPropertyMap = new Map<string, PropertyDefinition>();
Object.values(bossesNamesArray).forEach((bossName) => {
	bossPropertyMap.set(bossName, {
		name: bossName,
		setter: (count) => {
			if (!saveEditor.updateBossKillCount(bossName, count)) {
				throw new Error(`Boss "${bossName}" not found in game state.`);
			}
		},
	});
});

const miniBossPropertyMap = new Map<string, PropertyDefinition>();
Object.values(miniBossesNamesArray).forEach((miniBossName) => {
	miniBossPropertyMap.set(miniBossName, {
		name: miniBossName,
		setter: (count) => {
			if (!saveEditor.updateMiniBossKillCount(miniBossName, count)) {
				throw new Error(`Mini-Boss "${miniBossName}" not found in game state.`);
			}
		},
	});
});

const floorPropertyMap = new Map<string, PropertyDefinition>();
Object.values(floorsNamesArray).forEach((floorName) => {
	floorPropertyMap.set(floorName, {
		name: floorName,
		setter: (count) => {
			if (!saveEditor.updateFloorsCompletedCount(floorName, count)) {
				throw new Error(`Floor "${floorName}" not found in game state.`);
			}
		},
	});
});

program
	.name(meta.name)
	.description(meta.description)
	.version(meta.version, '-v, --version', 'Output the version number.');

program
	.argument(
		'[savefile]',
		'Specify the path to the save file (e.g., serial.txt).',
	)
	.argument(
		'[outputfile]',
		'Specify the path for the output save file. If omitted, the modified save data is printed to stdout.',
	)
	.option('-s, --stats', 'Display detailed statistics from the save file.')
	.option('-U, --unlock-all', 'Unlock all items and secrets.');

program.helpOption('-h, --help', 'Print this message.');
program.option(
	'-i, --unlock-item <name...>',
	'Unlock one or more specified items.',
);
program.option(
	'-l, --lock-item <name...>',
	'Lock one or more specified items.',
);
program.option(
	'-S, --unlock-secret <name...>',
	'Unlock one or more specified secrets.',
);
program.option(
	'-k, --lock-secret <name...>',
	'Lock one or more specified secrets.',
);
program.option(
	'-f, --set-floor <floor,count>',
	'Set the amount of times a specific floor was completed.',
	collect,
);
program.option(
	'-m, --set-mini-boss <miniboss,count>',
	'Set the amount of times a specific mini-boss was defeated.',
	collect,
);
program.option(
	'-b, --set-boss <boss,count>',
	'Set the amount of times a specific boss was defeated.',
	collect,
);
program.option(
	'-t, --set-stat <stat,count>',
	'Set the count for a specific game statistic.',
	collect,
);
program.option(
	'-L, --locked',
	'List all locked secrets and items in the save file.',
);
program.option(
	'-d, --display <type>',
	'Display a list of all available "stats", "items", "secrets", "bosses", "mini-bosses" and "floors".',
);
program.addHelpText(
	'after',
	`

Examples:
  ${meta.name} serial.txt -s  View the statistics from serial.txt file
  ${meta.name} -d bosses  View all the bosses in the game
  ${meta.name} serial.txt -i D20 BOX -t 'Deaths Count,21'  Unlock D20, BOX and change deaths count to 21
  ${meta.name} serial.txt output.txt -b 'Satan,183' -b 'Monstro,2'  Write new save to output.txt and change kill counts for 2 bosses`,
);

program.usage('[savefile] [outputfile] [options]');

program.action(async (savefile, outputfile, options) => {
	const requiresSaveFileForReading = options.stats || options.locked;

	const requiresSaveFileForModification =
		options.unlockSecret ||
		options.unlockItem ||
		options.unlockAll ||
		options.lockItem ||
		options.lockSecret ||
		options.setStat ||
		options.setBoss ||
		options.setMiniBoss ||
		options.setFloor;

	const requiresSaveFiles =
		requiresSaveFileForModification || requiresSaveFileForReading;

	if (!savefile && requiresSaveFiles) {
		console.error('Error: a file path is missing.');
		program.help();
	}

	try {
		if (options.stats) {
			const data = await readFileAsync(savefile);
			saveEditor.parse(data);
			displayStats();
			return;
		}

		if (options.locked) {
			const data = await readFileAsync(savefile);
			saveEditor.parse(data);

			const rawSecretsFromSave = saveEditor.getSecretsUnlocked();
			const rawItemsFromSave = saveEditor.getItemsCollected();

			const unlockedSecretNamesSet: Set<Secrets> = new Set(
				rawSecretsFromSave
					.filter((secret) => secret.unlocked)
					.map((secret) => secret.name),
			);

			const collectedItemNamesSet: Set<Collections> = new Set(
				rawItemsFromSave.filter((item) => item.unlocked).map((item) => item.name),
			);

			const notYetUnlockedSecrets: Secrets[] = [];
			for (const secretName of secretsNamesArray) {
				if (!unlockedSecretNamesSet.has(secretName)) {
					notYetUnlockedSecrets.push(secretName);
				}
			}

			const notYetCollectedItems: Collections[] = [];
			for (const itemName of itemsNamesArray) {
				if (!collectedItemNamesSet.has(itemName)) {
					notYetCollectedItems.push(itemName);
				}
			}
			console.log(
				'Secrets yet to be unlocked:',
				`\n${formatArray(notYetUnlockedSecrets)}`,
			);
			console.log(
				'Items yet to be collected:',
				`\n${formatArray(notYetCollectedItems)}`,
			);
			return;
		}

		if (options.help) {
			program.help();
		}

		if (requiresSaveFileForModification) {
			const data = await readFileAsync(savefile);
			saveEditor.parse(data);

			if (options.setStat) {
				handleCountOptions(options.setStat, statisticPropertyMap, 'set-stat');
			}

			if (options.setBoss) {
				handleCountOptions(options.setBoss, bossPropertyMap, 'set-boss');
			}

			if (options.unlockAll) {
				for (const secret of secretsNamesArray) {
					saveEditor.unlockSecret(secret);
				}
				for (const item of itemsNamesArray) {
					saveEditor.unlockItem(item);
				}
			}

			if (options.setMiniBoss) {
				handleCountOptions(
					options.setMiniBoss,
					miniBossPropertyMap,
					'set-mini-boss',
				);
			}
			if (options.setFloor) {
				handleCountOptions(options.setFloor, floorPropertyMap, 'set-floor');
			}

			if (options.unlockSecret && Array.isArray(options.unlockSecret)) {
				const invalidSecrets: string[] = [];
				for (const secret of options.unlockSecret) {
					if (
						typeof secret === 'string' &&
						secretsNamesArray.includes(secret as Secrets)
					) {
						saveEditor.unlockSecret(secret as Secrets);
					} else {
						invalidSecrets.push(secret);
					}
				}
				if (invalidSecrets.length > 0) {
					console.warn(
						`Warning: The following secret(s) are not valid and were not unlocked: ${invalidSecrets.join(', ')}`,
					);
				}
			}

			if (options.lockSecret && Array.isArray(options.lockSecret)) {
				const invalidSecrets: string[] = [];
				for (const secret of options.lockSecret) {
					if (
						typeof secret === 'string' &&
						secretsNamesArray.includes(secret as Secrets)
					) {
						saveEditor.lockSecret(secret as Secrets);
					} else {
						invalidSecrets.push(secret);
					}
				}
				if (invalidSecrets.length > 0) {
					console.warn(
						`Warning: The following secret(s) are not valid and were not locked: ${invalidSecrets.join(', ')}`,
					);
				}
			}

			if (options.lockItem && Array.isArray(options.lockItem)) {
				const invalidItems: string[] = [];
				for (const itemName of options.lockItem) {
					if (
						typeof itemName === 'string' &&
						itemsNamesArray.includes(itemName as Collections)
					) {
						saveEditor.lockItem(itemName as Collections);
					} else {
						invalidItems.push(itemName);
					}
				}
				if (invalidItems.length > 0) {
					console.warn(
						`Warning: The following item(s) are not valid and were not locked: ${invalidItems.join(', ')}`,
					);
				}
			}

			if (options.unlockItem && Array.isArray(options.unlockItem)) {
				const invalidItems: string[] = [];
				for (const itemName of options.unlockItem) {
					if (
						typeof itemName === 'string' &&
						itemsNamesArray.includes(itemName as Collections)
					) {
						saveEditor.unlockItem(itemName as Collections);
					} else {
						invalidItems.push(itemName);
					}
				}
				if (invalidItems.length > 0) {
					console.warn(
						`Warning: The following item(s) are not valid and were not unlocked: ${invalidItems.join(', ')}`,
					);
				}
			}

			const modifiedSaveData = saveEditor.toString();
			if (!outputfile) {
				console.log(modifiedSaveData);
			} else {
				await writeFileAsync(outputfile, modifiedSaveData);
				console.log(`Modified save data written to: ${outputfile}`);
			}

			return;
		}

		if (options.display) {
			const displayNames = {
				secrets: secretsNamesArray,
				items: itemsNamesArray,
				floors: floorsNamesArray,
				bosses: bossesNamesArray,
				stats: countProperties.map((property) => property.name),
				'mini-bosses': miniBossesNamesArray,
			};

			const namesToDisplay =
				displayNames[options.display as keyof typeof displayNames];

			if (namesToDisplay) {
				console.log(formatArray(namesToDisplay));
			} else {
				console.log(
					'Unknown type. Known types: stats, items, secrets, bosses, mini-bosses, floors.',
				);
			}

			return;
		}
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error('Error:', err.message);
			if ('code' in err && typeof err.code === 'string' && err.code === 'ENOENT') {
				console.error(`Please ensure the save file '${savefile}' exists.`);
			}
		} else {
			console.error('An unknown error occurred:', err);
		}
		process.exit(1);
	}
});

program.parse(process.argv);

const options = program.opts();

// If no argument or option is provided, show help
if (!process.argv.slice(2).length || Object.keys(options).length === 0) {
	program.help();
}
