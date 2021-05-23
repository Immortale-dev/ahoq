/** Node used to build a Aho Corasick container */
export class TrieNode {
	constructor() {
		/**
		 * Map of key/values containing child items of trie. key is
		 * {char} and value is {TrieNode}
		 */
		this._childs = {};

		/** Indicates wether specific pattern ends on this node */
		this._pattern = null;

		/**
		 * Stores reference to the longest suffix for current sequense
		 *
		 * Example:
		 *   1:      b -> c
		 *   2: a -> b -> c
		 *                ^
		 *                |
		 *  has an reference to the first pattern's "c" node
		 */
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
		 *  has an output link to the first pattern's "c" node
		 */
		this._out = null;
	}

	/**
	 * Returns child node or {@null} if it doesn't exists
	 *
	 * @param character: {char}
	 *
	 * @return {TrieNode|null}
	 */
	getChild(character) {
		if (!this._childs.hasOwnProperty(character)) return null;
		return this._childs[character];
	}

	/**
	 * Add child note
	 *
	 * @param character: {char}
	 * @param node: {TrieNode}
	 */
	setChild(character, node) {
		this._childs[character] = node;
	}

	/**
	 * Returns array of child entries
	 */
	getChildEntries() {
		return Object.entries(this._childs);
	}

	/**
	 * Removes child node
	 *
	 * @param character: {char}
	 */
	removeChild(character) {
		delete this._childs[character];
	}

	/**
	 * Get current node's associated pattern
	 *
	 * @return {string|null}
	 */
	getPattern() {
		return this._pattern;
	}

	/**
	 * Set or unset current node's associated pattern
	 *
	 * @param pattern: {String|null}
	 */
	setPattern(pattern) {
		this._pattern = pattern;
	}

	/**
	 * Returns associated with current node suffix reference
	 *
	 * @return {TrieNode|null}
	 */
	getSuffix() {
		return this._suffix;
	}

	/**
	 * Set or unset current node's associated suffix node
	 *
	 * @param suffix: {String|null}
	 */
	setSuffix(suffix) {
		this._suffix = suffix;
	}

	/**
	 * Returns an output node
	 *
	 * @return {TrieNode|null}
	 */
	getOut() {
		return this._out;
	}

	/**
	 * Set/unset an output node
	 *
	 * @param out: {TrieNode|null}
	 */
	setOut(out) {
		this._out = out;
	}
}
