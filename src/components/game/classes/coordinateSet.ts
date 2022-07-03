/**
 * uses an internal tree structure to simulate set-like behaviour
 * used in GameEngine class to defined a set of "occupied" coordinates where food should not be spawned
 */ 
export default class CoordinateSet {
  tree: Record<number, Record<number, boolean>> = {}

  add(x: number, y: number) {
    this.tree[x] ||= {} // if there's already an entry for x, don't reassign
    this.tree[x][y] = true;
  }

  remove(x: number, y: number) {
    // if the coordinate doesn't exist, don't do anything
    if (!this.tree[x] || !this.tree[y]) {
      return;
    }

    // otherwise, delete it
    delete this.tree[x][y];

    // if the branch has no leaves, delete the branch, too
    if (!Object.keys(this.tree[x]).length) {
      delete this.tree[x]
    }
  }

  has(x: number, y: number) {
    return !!this.tree[x]?.[y]; // this.tree[x]?.[y] can return undefined, and !!undefined == true
  }
}