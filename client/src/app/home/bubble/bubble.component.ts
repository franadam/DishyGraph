import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css'],
})
export class BubbleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log(`data`, this.data);
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  @Input() data: any;
  @Input() countries: any;

  private svg: any;
  private graph: any;
  private margin = 50;
  private width = 1050;
  private height = 1720;
  // The radius of the pie chart is half the smallest side
  private colors: any;
  private grid = { row: 15, width: 50 };

  private createSvg(): void {
    this.svg = d3
      .select('figure#bubble')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.graph = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(): void {
    this.colors = d3
      .scaleOrdinal(d3.schemeSet2)
      .domain([
        ...this.data.map((d: any) => this.countries[d.SpatialDim].ParentTitle),
        'Other',
      ]);
    console.log(`this.colors('Other')`, this.colors('Other'));
  }

  private calculateGridPos = (i: number) => {
    return [
      ((i % this.grid.row) + 0.5) * this.grid.width,
      (Math.floor(i / this.grid.row) + 0.5) * this.grid.width,
    ];
  };

  private drawChart(): void {
    const countries = this.svg
      .selectAll('.country')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('fill', (d: any) =>
        this.colors(this.countries[d.SpatialDim].ParentTitle || 'Other')
      )
      .attr('fill-opacity', 0.5)
      .attr('r', 8)
      .attr(
        'transform',
        (_: any, i: number) => `translate(${this.calculateGridPos(i)})`
      )
      .attr('stroke', (d: any) =>
        this.colors(this.countries[d.SpatialDim].ParentTitle || 'Other')
      )
      .style('stroke-width', 1);
    countries
      .selectAll('text')
      .enter()
      .append('text')
      .attr('x', 0)
      .attr('y', '.35em')
      .text((d: any) => d.SpatialDim);
  }
}
