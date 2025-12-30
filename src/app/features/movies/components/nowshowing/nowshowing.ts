import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Card } from "../../../../shared/components/card/card";
import { Movie } from "../../../../shared/model/movie";

@Component({
  selector: "app-now-showing",
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: "./nowshowing.html",
})
export class NowShowingComponent {
  @Input() movies: Movie[] | null = [];
}