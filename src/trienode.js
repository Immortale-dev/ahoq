/** Node used to build a Aho Corasick container */
export class TrieNode {
	constructor() {
		/**
		 * Map of key/values containing child items of trie. key is
		 * {@char} and value is {@TrieNode}
		 */
		this._childs = {};

		/** Indicates wether specific pattern ends on this node */
		this._pattern = null;

		/** Stores reference to the longest suffix for current sequense */
		this._suffix = null;

		/**
		 * Indicates wether other pattern ends as a suffix on this node
		 * In case of multiple patterns ends at the same node, contains
		 * the link for the longest one
		 *
		 * Example:
		 *  1:      b -> c
		 *  2: a -> b -> c -> d
		 *               ^
		 *               |
		 *  has an output link to the first pattern
		 */
		this._out = null;
	}

	/**
	 * Returns child node or {@null} if it doesn't exists
	 *
	 * @parameters:
	 *   character: {@char}
	 *
	 * @return:
	 *   {@TrieNode}|{@null}
	 */
	getChild(character) {
		if (!this._childs.hasOwnProperty(character)) return null;
		return this._childs[character];
	}

	/**
	 * Add child note
	 *
	 * @parameters:
	 *   character: {@char}, node: {@TrieNode}
	 */
	setChild(character, node) {
		this._childs[character] = node;
	}

	/**
	 * Removes child node
	 *
	 * @parameters:
	 *   character: {@char}
	 */
	removeChild(character) {
		delete this._childs[character];
	}

	/**
	 * Set or unset current node's associated pattern
	 *
	 * @parameters:
	 *   pattern: {@String}|{@null}
	 */
	setPattern(pattern) {
		this._pattern = pattern;
	}

	/**
	 * Set or unset current node's associated suffix
	 *
	 * @parameters:
	 *   suffix: {@String}|{@null}
	 */
	setSuffix(suffix) {
		this._suffix = suffix;
	}

	/**
	 * Set/unset an output node
	 *
	 * @parameters:
	 *   out: {@TrieNode}
	 */
	setOut(out) {
		this._out = out;
	}
}
