# The Binding of Isaac Flash Save Editor

An editor for [The Binding of Isaac](https://store.steampowered.com/app/113200/The_Binding_of_Isaac/) (Flash version) `serial.txt` save file. It can be used to unlock items, secrets and change your stats.

## Features

- Parses and extracts data from `serial.txt` save files.
- Provides a structured way to manipulate save data.
- Has a command-line interface.

**NOTE**: This project is not well-tested. Make sure to back up your game data before using it. Copy both the `serial.txt` and `so.sol` files to ensure you can recover your progress if anything goes wrong. Please contact me if anything goes wrong and I'll try to fix fix the bug that caused it.

## Installation

To install the editor as a library, run the following command:


```sh
npm install tboi-flash-save-editor
```

To install as a cli:


```sh
npm install -g tboi-flash-save-editor
```

## Common Questions

### 1. Where is `serial.txt`?

The `serial.txt` file is typically found in the game's directory, alongside the executable.

- **Windows**: `..\Steam\steamapps\common\The Binding Of Isaac\`
- **Mac**: `~/Library/Application Support/Steam/SteamApps/common/the binding of isaac rebirth/`
- **Linux**: `~/.steam/steam/steamapps/common//The Binding Of Isaac/`

### 2. My progress isn't updating or nothing gets unlocked!

If your save data doesn't seem to update, try deleting your `so.sol` file. This file is deprecated but still used by the game to sync with `serial.txt`.

- **Windows**: `%appdata%\Macromedia\Flash Player\#SharedObjects\<some random string>\localhost\`
- **Mac**: `~/Library/Preferences/Macromedia/Flash Player/#SharedObjects/4UUE5CSF/localhost/`
- **Linux**: `~/.macromedia/Flash_Player/#SharedObjects/randomstring/localhost/so.sol`

For more information, refer to [this article](https://bindingofisaac.fandom.com/wiki/Save_Data#How_serial.txt_works) on The Binding of Isaac Wiki.


## Usage

### Command line interface

```
$ tboi-flash-save-editor -h
Usage: tboi-flash-save-editor [savefile] [outputfile] [options]

An editor for The Binding of Isaac serial.txt save file

Arguments:
  savefile                              Specify the path to the save file (e.g., serial.txt).
  outputfile                            Specify the path for the output save file. If omitted, the modified save data is printed to stdout.

Options:
  -v, --version                         Output the version number.
  -s, --stats                           Display detailed statistics from the save file.
  -U, --unlock-all                      Unlock all items and secrets.
  -i, --unlock-item <name...>           Unlock one or more specified items.
  -l, --lock-item <name...>             Lock one or more specified items.
  -S, --unlock-secret <name...>         Unlock one or more specified secrets.
  -k, --lock-secret <name...>           Lock one or more specified secrets.
  -f, --set-floor <floor,count>         Set the amount of times a specific floor was completed.
  -m, --set-mini-boss <miniboss,count>  Set the amount of times a specific mini-boss was defeated.
  -b, --set-boss <boss,count>           Set the amount of times a specific boss was defeated.
  -t, --set-stat <stat,count>           Set the count for a specific game statistic.
  -L, --locked                          List all locked secrets and items in the save file.
  -d, --display <type>                  Display a list of all available "stats", "items", "secrets", "bosses", "mini-bosses" and "floors".
  -h, --help                            Print this message.


Examples:
  tboi-flash-save-editor serial.txt -s  View the statistics from serial.txt file
  tboi-flash-save-editor -d bosses  View all the bosses in the game
  tboi-flash-save-editor serial.txt -i D20 BOX -t 'Deaths Count,21'  Unlock D20, BOX and change deaths count to 21
  tboi-flash-save-editor serial.txt output.txt -b 'Satan,183' -b 'Monstro,2'  Write new save to output.txt and change kill counts for 2 bosses
```

### Node JS library

```js
import { SaveEditor } from 'tboi-flash-save-editor';

const editor = new SaveEditor();

// Sample save string (contains all secrets unlocked)
const mySaveString = `8368483363880242075421014404153202610417376862552834616636650562633468860349756683014106572909430714310164031636616134270769613568846142376481024374558202460516230842051539696356153569643326066369346703378686313982078436348378013336847702214336760522433686332640368683366830848736388004803532807400313380760021433666032240368683264836848336388084873538807450313280740021138676052143366603224036868326,0,0,0,896,14890,8734,105,565,13954,301,50242,0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1,0'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1'1,0'513'693'426'551'375'455'341'410'302'0'0,1'1'1'1'1'1'1'0'0'0,1394,274`

editor.parse(mySaveString);
console.log(editor.getMomKillsCount()); // Output: 896

editor.setMomKillsCount(412);
console.log(editor.getMomKillsCount()); // Output: 412
```

Get Unlocked Secrets

```js
console.log(editor.getSecretsUnlocked());
// Output: Array of unlocked secrets, such as:
// [
//   { name: 'Maggy', unlocked: true },
//   { name: 'Cain', unlocked: true },
//   { name: 'Judas', unlocked: true },
//   { name: 'The Womb Floors', unlocked: true },
//   { name: 'Horsemen Appear', unlocked: true },
//   { name: 'Cube of Meat', unlocked: true },
//   ...
// ]
```

Unlock or Lock Items and Secrets

```js
// Unlock an item
editor.unlockItem('PHD');

// Lock an item
editor.lockItem('PHD');

// Unlock a secret
editor.unlockSecret('D20');

// Lock a secret
editor.lockSecret('D20');
```

Get a string for serial.txt 

```js
const newSaveString = editor.toString();
console.log(newSaveString);
// Output: A string formatted for serial.txt, such as:
// 8368483363880242075421014404153202610417376862552834616636650562633468860349756683014106572909430714310164031636616134270769613568846142376481024374558202460516230842051539696356153569643326066369346703378686313982078436348378013336847702214336760522433686332640368683366830848736388004803532807400313380760021433666032240368683264836848336388084873538807450313280740021138676052143366603224036868326,0,0,0,896,14890,8734,105,565,13954,301,50242,0'1'1'...
```

## Scripts

- `test` - Runs tests using Jest
- `build` - Compiles TypeScript
- `type` - Checks TypeScript types

## Resources

This project was inspired by [Himsl Games's video](https://www.youtube.com/watch?v=0aMURcjvbEI), titled "Save Files Explained in The Binding of Isaac!" - a fantastic explanation of the game's save system.


Additionally, a big thank you to [The Binding of Isaac Wiki](https://bindingofisaac.fandom.com/) for its detailed resources.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under [the MIT License](LICENSE).
