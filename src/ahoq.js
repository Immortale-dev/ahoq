import {TrieNode as Node} from './trienode.js';
import {Queue} from 'real-queue';

/**
 * Class for building Aho Corasick structure from text patterns and
 * search these patterns in text for linear time O(n) where n = length
 * of the text.
 *
 * constructor accepts list of patterns.
 */
export class AhoQ {
	/**
	 * @constructor
	 *
	 * @param patterns: {string[]}
	 */
	constructor(patterns) {
		this._trie = null;
		this._patterns = new Set();

		if (patterns) {
			this._validatePatterns(patterns);
			this._patterns = new Set(patterns.map(str => new String(str)));
		}

		this._rebuild();
	}

	/**
	 * Adds new patterns and rebuild the trie.
	 *
	 * @param patterns: {string[]}
	 */
	add(patterns) {
		if(!patterns) return;
		this._validatePatterns(patterns);
		for(const pat of patterns) {
			this._patterns.add(pat);
		}
		this._rebuild();
	}

	/**
	 * Removes patterns and rebuild the trie.
	 *
	 * @param patterns: {string[]}
	 */
	remove(patterns) {
		if(!patterns) return;
		this._validatePatterns(patterns);
		for(const pat of patterns) {
			this._patterns.delete(pat);
		}
		this._rebuild();
	}

	/**
	 * Returns iterable object that will search for the matches in text
	 * by lazy manner.
	 *
	 * @param options: {AhoQOptions}
	 *
	 * @return {AhoQSearch}
	 */
	search(text, options) {
		if(!options){
			options = {};
		}
		if(!options.report) {
			options.report = AhoQ.REPORT.MATCH;
		}

		return this._createIterableSearch(text, options);
	}

	/**
	 * Returns all matches of patterns in text
	 *
	 * @return {AhoQSearchResult[]}
	 */
	find(text) {
		const search = this._createIterableSearch(text);
		return [...search].flat();
	}

	// Rebuilds the trie
	_rebuild() {
		// Create new root node
		const root = new Node();
		this._trie = root;

		// Build trie base structure
		for(const pat of this._patterns) {
			let node = root;
			for(const char of pat) {
				if(!node.getChild(char)) {
					node.setChild(char, new Node());
				}
				node = node.getChild(char);
			}

			// Patterns ends at this node
			node.setPattern(pat);
		}

		// Use queue to perform an upper manner DP algorithm for filling
		// up all suffix and output references
		const queue = new Queue();

		// Suffix reference of root node should be root node
		root.setSuffix(root);

		// Suffix reference of first level nodes should be root node as
		// the longer suffix of single character strings is empty string
		for(const ent of root.getChildEntries()){
			const node = ent[1];
			node.setSuffix(root);
			queue.push(node);
		}

		// BFS
		while(!queue.empty()) {
			const node = queue.front();
			queue.pop();

			for(const ent of node.getChildEntries()) {
				// Define refs
				const c = ent[0];
				const n = ent[1];

				// Find longest suffix of current path (DP)
				let suff = node.getSuffix();
				while(!suff.getChild(c) && suff != root) {
					suff = suff.getSuffix();
				}

				// Set suffix
				const foundSuffix = suff.getChild(c) || root;
				n.setSuffix(foundSuffix);

				queue.push(n);
			}

			// Update output reference
			if(node.getSuffix().getPattern()) {
				node.setOut(node.getSuffix());
			} else {
				node.setOut(node.getSuffix().getOut());
			}
		}
	}

	_createIterableSearch(text, options) {
		return new AhoQSearch(text, this._trie, options);
	}

	_validatePatterns(patterns) {
		if(!Array.isArray(patterns)) {
			throw new Error('patterns shoukd be an Array of strings');
		}

		for(const pat of patterns){
			if(typeof pat != 'string' && !(pat instanceof String) ) {
				throw new Error('patterns shoukd be an Array of strings');
			}
		}
	}
}

/**
 * AhoQ::search options type
 */
export class AhoQOptions {
	constructor() {
		this.report = null;
	}
}

/**
 * Iterable calsee that allows to get the search results.
 */
export class AhoQSearch {
	constructor(text, trie, options) {
		this._text = text;
		this._trie = trie;
		this._pos = 0;
		this._state = null;
		this._options = options || {};

		this[Symbol.iterator] = () => {
			return this;
		}
	}

	/**
	 * Get current position in the text.
	 *
	 * @return {number} - position in the text
	 */
	getPos() {
		return this._pos;
	}

	/**
	 * Set position in the text.
	 *
	 * @param pos: {number} new position in the text
	 */
	setPos(pos) {
		this._pos = pos;
	}

	/**
	 * Reset current state to the root of the trie.
	 */
	reset() {
		this._state = this._trie;
	}

	/**
	 * Reset state and position in text to the beginning.
	 */
	reload() {
		this.setPos(0);
		this.reset();
	}

	/**
	 * Get next occurence.
	 *
	 * @param report: {AhoQ.REPORT} - type of report
	 *
	 * @return {AhoQSearchResult}
	 */
	next(report) {
		if(report == undefined) {
			report = this._options.report;
		}

		// Start from root node
		if(!this._state) {
			this.reset(); // root
		}

		// Search char by char
		while(this._pos < this._text.length) {
			let c = this._text[this._pos];

			while(!this._state.getChild(c) && this._state !== this._trie) {
				this._state = this._state.getSuffix();
			}
			while(!this._state.getChild(c)) {
				if(report === AhoQ.REPORT.STEP) {
					++this._pos;
					return {value:[], done: false};
				}
				if(++this._pos >= this._text.length) return {done: true};
				c = this._text[this._pos];
			}

			// Move by trie
			this._state = this._state.getChild(c);

			// Collect matches
			const ret = [];
			const pat = this._state.getPattern();
			if(pat) {
				ret.push(new AhoQSearchResult(pat, this._pos - pat.length + 1));
			}
			let outNode = this._state.getOut();
			while(outNode) {
				const pat = outNode.getPattern();
				ret.push(new AhoQSearchResult(pat, this._pos - pat.length + 1));
				outNode = outNode.getOut();
			}

			++this._pos;

			if(ret.length || report === AhoQ.REPORT.STEP) {
				return {value: ret, done: false};
			}
		}

		return {done: true};
	}
}

/** Search result type */
export class AhoQSearchResult {
	constructor(pattern, index) {
		this.pattern = pattern;
		this.index = index;
	}
}

/** Report options */
AhoQ.REPORT = {
	MATCH: 0,
	STEP: 1
};
