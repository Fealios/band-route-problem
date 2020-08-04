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

  constructor(private svcData: DataService) {}

  ngOnInit() {
    this.svcData.getData().subscribe(
      (nodes) => {
        this.allNodes = nodes.map((node, index) => {
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
}
