import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Card } from "../card/card";
import { Movie } from "../../model/movie";

@Component({
  selector: "app-now-showing",
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: "./nowshowing.html",
})
export class NowShowingComponent {
  @Input() movies: Movie[] | null = [];
}