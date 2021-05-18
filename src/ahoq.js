import {TrieNode as Node} from './trienode'

/**
 * Class for building Aho Corasick structure from text patterns and
 * search these patterns in text for linear time O(n) where n = length
 * of the text.
 * 
 * constructor accepts list of patterns.
 */
export class AhoQ {
	constructor(patterns) {
		this._trie = null;
		
		if (!patterns) return;
		
		this._validatePatterns(patterns);
		
		this._patterns = new Set(patterns.map(str => new String(str)));
		this._rebuild();
	}
	
	add(patterns) {
		if(!patterns) return;
		this._validatePatterns(patterns);
		for(const pat of patterns) {
			this._patterns.add(pat);
		}
	}
	
	remove(patterns) {
		if(!patterns) return;
		this._validatePatterns(patterns);
		for(const pat of patterns) {
			this._patterns.delete(pat);
		}
	}
	
	search(text, options) {
		
	}
	
	find(text) {
		
	}
	
	_rebuild() {
		// Create new root node
		this._trie = new Node();
		
		// Build trie base structure
		for(const pat of this._patterns) {
			const node = this._trie;
			for(const char of pat) {
				if(!node.getChild(char)) {
					node.setChild(char, new Node());
				}
				node = node.getChild(char);
			}
			
			// Patterns ends at this node
			node.setPattern(pat);
		}
		
		//TODO: extend with failure links
	}
	
	_createIterableSearch(text) {
		return new AhoQSearch(text, this._trie, options);
	}
	
	_validatePatterns(patterns) {
		if(!Array.isArray(patterns)) {
			throw new Error('patterns shoukd be an Array of strings');
		}
		
		for(const pat of patterns){
			if(typeof pat != 'string' || !(pat instanceof String) ) {
				throw new Error('patterns shoukd be an Array of strings');
			}
		}
	}
}

class AhoQSearch {
	constructor(text, trie) {
		this._text = text;
		this._trie = trie;
		this._pos = 0;
		this._state = null;
		this._options = options;
	}
	
	//TODO: iterable object
}
