import {TrieNode as Node} from './trienode';
import {Queue} from 'real-queue';

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
		const root = new Node();
		this._trie = root;
		
		// Build trie base structure
		for(const pat of this._patterns) {
			const node = root;
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
				const suff = node.getSuffix();
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
