class PriorityQueue {
    constructor() {
      this.heap = [];
    }
  
    parent(index) {
      if (index === 0){
        return 0;
      }
      return Math.floor(Math.floor(index - 1)/2);
    }
  
    length() {
      return this.heap.length;
    }
  
    insert(cell) {
      this.heap.push(cell);
      this.heapifyUp(this.heap.length -1);
    }
  
    heapifyUp(index) {
      while(this.heap[index].f < this.heap[this.parent(index)].f) {
        this.swap(index,this.parent(index));
        index = this.parent(index);
      }
    }
  
    swap(index1, index2) {
      let temp = this.heap[index1];
      this.heap[index1] = this.heap[index2];
      this.heap[index2] = temp;
    }
  
    remove(index) {
      this.swap(index,this.heap.length-1);
      this.heap.pop();
      this.heapifyDown(index);
    }
  
    heapifyDown(index) {
      let indexOfSmallestChild = this.getIndexOfSmallestChild(index);
      let current = index;
      while(indexOfSmallestChild < Number.MAX_VALUE) {
        this.swap(current,indexOfSmallestChild);
        current = indexOfSmallestChild;
        indexOfSmallestChild = this.getIndexOfSmallestChild(current);
      }
  
    }
  
    getIndexOfSmallestChild(index) {
      let valueOfSmallestChild = Number.MAX_VALUE;
      let indexOfSmallestChild = Number.MAX_VALUE;
      if (2 * index + 1 < this.heap.length && this.heap[2* index + 1].f < this.heap[index].f) {
        valueOfSmallestChild = this.heap[2 * index + 1].f;
        indexOfSmallestChild = 2 * index + 1;
      }
      if (2 * index + 2 < this.heap.length && this.heap[2* index + 2].f < this.heap[index].f) {
        valueOfSmallestChild = Math.min(valueOfSmallestChild,this.heap[2 * index + 2].f);
        indexOfSmallestChild = 2 * index + 2;
      }
      return indexOfSmallestChild;
    }
  
    getMin() {
      return this.heap[0];
    }
  
    extractMin() {
      let min = this.getMin();
      this.remove(0);
      return min;
    }
  
    get(index) {
      return this.heap[index];
    }
  
    indexOf(cell) {
      for (let i = 0; i < this.heap.length;i++){
        if (cell === this.heap[i]){
          return i;
        }
      }
      return -1;
    }
  }

  export default PriorityQueue;