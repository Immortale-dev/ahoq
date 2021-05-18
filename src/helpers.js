/** Class represents basic queue functionality */
export class Queue {
	constructor() {
		
		/** Reference to the first item in queue */
		this._root = null;
		
		/** Reference to the last item in queue */
		this._last = null;
		
		/** keep track of size of trie */
		this._size = 0;
		
	}
	
	size() {
		return this._size;
	}
	
	push(data) {
		const newNode = new QueueItem(data);
		if(!this._last) {
			this._root = newNode;
			this._last = newNode;
		} else {
			this._last.next = newNode;
			this._last = newNode;
		}
		this._size++;
	}
	
	front() {
		return this._root.data;
	}
	
	pop() {
		if(!this._root) return
		
		const root = this._root;
		this._root = this._root.next;
		
		if(!this._root) {
			this._last = null;
		}
		
		if(this._size-- <= 0) {
			this._size = 0;
		}
		
		return root.data;
	}
}

class QueueItem {
	constructor(data) {
		
		/** Reference to the queue item data */
		this.data = data;
		
		/** Reference to the next item in queue */
		this.next = null;
	}
}
