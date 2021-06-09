# Aho Corasick JS

Aho Corasick pattern search algorithm that provides linear time search searching of bunch of patterns.
 
**Time complexity:** _O(m)_ for preparation and _O(n+r)_ for searching where
* _n_ - length of the searching text
* _m_ - the summ of length of all searching patterns
* _r_ - search result count

## Requirements
- NodeJS: **13.2+**
- NPM: **6.13+**

## Install
```bash
npm install ahoq
```

## Docs

Package provides couple of classes:
* **AhoQ** - main class
* **AhoQSearch** - class returned from AhoQ::search public method and provides ability for advanced usage of searching algorithm described below.
* **AhoQSearchResult** - search result item type
* **AhoQOptions** - search options typeˇ

### AhoQ
---

Main class used for pattern searching

#### constructor(patterns: string[])
Accepts the list of patterns as a string array and creates a **AhoQ** instance.

#### add(patterns: string[]): void
Accepts the list of patterns, adds new pattern list to the existing one and rebuild internal searching structure. 

#### remove(patterns: string[]): void
Accepts the list of patterns, removes passed patterns from the existing lit and rebuild internal searching structure.

#### search(text: string, options: AhoQOptions): AhoQSearch
Main method to search the patterns in the text. It requires *text* to be passed as the first parameter, and *options* - optional parameter where you can set the search options.

It returns **AhoQSearch** instance that could be used to get the search results.

***Example:***
```javascript
const ahoq = new AhoQ(['a', 'b', 'c']);
const ahoqSearch = ahoq.search('asdzxcqweb');
const results = [...ahoqSearch];
```

#### find(text: string): AhoQSearchResult[]
Another method to search the patterns in text. This method is much simpler. It accepts the *text* that will be searched, and it returns the array of search results.

***Example:***
```javascript
const ahoq =  new  AhoQ(['a',  'b',  'c']);
const results = ahoq.find('asdzxcqweb');
```

### AhoQSearch
---

Class for retrieving search results
Constructing the object manually is not allowed. You can get the instance of **AhoQSearch** class by calling `Ahoq::search` method. 

This class manage internal states of Aho Corasick data structure, and you can lazy search the patterns and manage the states and position in text which gives you a lot of flexibility and potential performance optimisation (depends on the tasks you want to perform)

Class implements iterator methods, so you can use **for of** and **spread** operator.

***Notice:*** *You can find couple of examples of using advanced searching in tests* 

#### getPos(): number

returns position in text searching is performing now

#### setPos(pos: number): void

accepts the number, that will be set as the new position in the text.

#### reset(): void

Resets the internal searching state, e.g. if the word stating to match, it will reset the current match.

#### reload(): void

Reloads the searching, e.g. resets the state and sets text position to 0.

#### next(): {value: AhoQSearchResult[], done: boolean}

Proceed the search and returns the next search results. This method used as an iterator next method.

### AhoQOptions
---

Data class that represents search options

Contains one property: **report**: *AhoQ.REPORT*

There is 2 options in **AhoQ.REPORT** enum:

- MATCH
- STEP

**MATCH** used by default. 

In case of **MATCH** report property used, the **AhoQSearch::next** method will return search results in case of any match found, and in case of **STEP** report value used, **AhoQSearch::next** will return on every character in the searching text.

### AhoQSearchResult
---

Search result data class returned from **AhoQ::find** and **AhoQSearch::next** methods.

Class contain 2 properties:

- **pattern**: *String*
- **index**: *number*

representing the **pattern** found in the text (notice, pattern returned not as primitive type, but as a *String object*) and **index** in text where the pattern *starts*.

## Example

```javascript
import {AhoQ} from 'ahoq'

const ahoq = new AhoQ(['ab', 'aa', 'bc', 'abc', 'aaa', 'aab']);
let result = ahoq.find('aabbcaabc');

/**
 * result:
 * [
 *  {index:0, pattern: 'aa'},
 *  {index:0, pattern: 'aab'},
 *  {index:1, pattern: 'ab'},
 *  {index:3, pattern: 'bc'},
 *  {index:5, pattern: 'aa'},
 *  {index:5, pattern: 'aab'},
 *  {index:6, pattern: 'ab'},
 *  {index:6, pattern: 'abc'},
 *  {index:7, pattern: 'bc'}
 * ]
 */

ahoq.remove(['ab', 'bc', 'aaa', 'aa']);
const search = ahoq.search('asdasabcsdaabbbasd');

for (const it of search) {
	// it - contains next results
	// you can change position in the text, or reset the state
	// or whatever
}

```

## Time complexity

- **O(n + r)** - for searching, where *n* corresponds to the length of searching text, and *r* represents the number of found 
- **O(m)** - for preparing (building internal structures), where *m* represents the sum of all the pattern lengths used in search.

**Internal structure rebuilds** on constructing the **AhoQ** instance, and every time **AhoQ::add** and **AhoQ::remove** used. 

## License

MIT

Have fun! :)
