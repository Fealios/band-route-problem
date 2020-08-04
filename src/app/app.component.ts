import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from './services/data.service';
import { Node } from './models/node';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public allNodes: Node[]; // hold all nodes in unmodified state

  constructor(private svcData: DataService) {}

  ngOnInit() {
    this.svcData.getData().subscribe(
      (nodes) => {
        this.allNodes = nodes.map((node, index) => {
          // map all the data given and turn them into Node objects, with IDs and visited boolean
          node.id = index;
          node.visited = false;
          return node;
        });
      },
      (err) => {
        console.log(err);
      },
      () => {
        console.log(this.allNodes);
      }
    );
  }

  ngAfterViewInit() {
    this.allNodes.map((node) => {
      this.displayNode(node);
    });
  }

  private displayNode(node: Node): void {
    const graph = document.getElementById('graph');
    const nodeElement = document.createElement('span');
    nodeElement.innerText = `${node.id}`;
    nodeElement.classList.add('venue');
    nodeElement.id = `${node.id}`;

    nodeElement.style.cssText = `left: ${node.x}px; top: ${node.y}px; position: relative; border: solid 1px blue; border-radius: 50%; width: 20px; height: 20px`;
    graph.appendChild(nodeElement);
  }

  private findClosestNeighbors() {
    // this method finds the pair that has the shortest distance to start things off
    let hypotenuse = Number.MAX_SAFE_INTEGER;
    const l = this.allNodes.length;
    let shortestNeighbors = { a: Node = null, b: Node = null };

    for (let i = 0; i < l - 1; i++) {
      const incremented = i + 1;
      for (let j = incremented; j < l; j++) {
        const newHypotenuse = this.pythagoreum(
          this.allNodes[i],
          this.allNodes[j]
        );
        if (newHypotenuse < hypotenuse) {
          hypotenuse = newHypotenuse;
          shortestNeighbors.a = this.allNodes[i];
          shortestNeighbors.b = this.allNodes[j];
        }
      }
    }

    return shortestNeighbors;
  }

  private pythagoreum(node1: Node, node2: Node) {
    const x = Math.abs(node2.x - node1.x);
    const y = Math.abs(node2.y - node1.y);
    return Math.hypot(x, y);
    // Math.hypot is not supported on IE, but is standard in ES2015, so whos fault is that?
  }
}
