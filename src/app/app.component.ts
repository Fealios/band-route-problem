import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { Node } from './models/node';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public allNodes: Node[]; // hold all nodes in unmodified state
  public routeLength: number = 0;

  constructor(private svcData: DataService) {}

  ngOnInit() {
    this.svcData.getData().subscribe(
      (nodes) => {
        this.allNodes = nodes.map((node, index) => {
          // map all the data given and turn them into Node objects, with IDs and visited boolean
          node.id = index;
          node.visited = false;
          this.displayNode(node);
          return node;
        });

        const start = this.findRootNode2();
        this.highlightNode(start, 'start');
        this.routeLength = this.traverseFromRoot(start);
      },
      (err) => {
        console.log(err);
      },
      () => {
        // console.log(this.allNodes);
      }
    );
  }

  private displayNode(node: Node): void {
    const graph = document.getElementById('graph');
    const nodeElement = document.createElement('span');
    nodeElement.innerText = `${node.id}`;
    nodeElement.classList.add('venue');
    nodeElement.id = `${node.id}`;

    nodeElement.style.cssText = `left: ${node.x}px; bottom: ${node.y}px;`;
    graph.appendChild(nodeElement);
  }

  private findRootNode2(): Node {
    let minDistance = Number.MAX_SAFE_INTEGER;
    const graphRoot: Node = { x: 0, y: 0, id: null, visited: false };
    let current = null;
    for (const node of this.allNodes) {
      const distance = this.pythagoreum(graphRoot, node);
      if (distance < minDistance) {
        current = node;
        minDistance = distance;
      }
    }

    return current;
  }

  private findRootNode(root: Node = null): Node {
    // find the node closest to 0,0 to traverse from.
    let current: Node = root;
    let end = true;
    for (const node of this.allNodes) {
      if (node.x < root.x && node.y < root.y) {
        current = node;
        end = false;
      }
    }

    if (end) {
      return current;
    }
    return current;
  }

  private traverseFromRoot(root: Node, length = 0): number {
    root.visited = true;
    let routeLength = length;
    let current = root;
    let end = true;
    // initialize with the root node, set its visited property to true.
    // set routeLength to = if nothing is passed, otherwise recursively set it to sum of minDistances.
    // the 'end' variable markes the end of traversal, we set it to true until proven otherwise to avoid
    // infinite looping.

    let minDistance = Number.MAX_SAFE_INTEGER;
    // initialize minDistance to max JS number for logistical safety

    for (const destination of this.allNodes) {
      if (destination.id === root.id || destination.visited) {
        continue;
        // if the destination is the current, or if it's been visited, skip it
      }

      const distance = this.pythagoreum(root, destination);
      // we check against root NOT current, because current is in flux and root is where
      // we are actually coming from.
      if (distance < minDistance) {
        current = destination;
        minDistance = distance;
        end = false;
        // since we have discovered an unvisited or a shorter route, set end to false.
      }
    }

    if (end) {
      // i wanted this to be a turnary statement, but i think because of the type safety
      // the compiler wasn't accepting it, so here we are.
      this.highlightNode(current, 'end');
      return routeLength;
      // if it's the end return the length of the routes
    } else {
      routeLength += minDistance;
      // the end of the loop has been reached, concat the current route length with smallest found.
      return this.traverseFromRoot(current, routeLength);
      // if it's not the end, recurse with current node, and current routeLenght
    }
  }

  private pythagoreum(node1: Node, node2: Node) {
    // algebra mother f****r, do you speak it?
    const x = Math.abs(node2.x - node1.x);
    const y = Math.abs(node2.y - node1.y);
    return Math.hypot(x, y);
    // Math.hypot() is not supported on IE, but is standard in ES2015, so whos fault is that?
  }

  private highlightNode(node: Node, position: 'start' | 'end'): void {
    const element = document.getElementById(`${node.id}`);
    position === 'start'
      ? element.classList.add('start')
      : element.classList.add('end');
  }
}
