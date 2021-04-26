import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

import CountryDictionary from 'src/app/country.interface';
import { Hierarchy } from 'src/app/graphData.interface';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css'],
})
export class BubbleComponent implements OnInit {
  constructor() {}

  
  @Input() data: Hierarchy[] = [];
  @Input() countries: CountryDictionary = {};


  private svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private rScale!: d3.ScaleLinear<number, number, never>;
  private graph!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private colors!: d3.ScaleOrdinal<string, string, never>;
  private margin = 50;
  private width = 1050;
  private height = 1720;
  // The radius of the pie chart is half the smallest side
  private grid = { row: 15, width: 50 };

  ngOnInit(): void {
    this.createSvg();
    this.createColors();
    this.createScale();
    this.drawChart();
    console.log(`BubbleComponent data`, this.data);
    console.log(
      `BubbleComponent data map`,
      this.data.filter((d) => d.value != null).map((d) => d.value)
    );
  }

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
      .domain([...this.data.map((d: any) => d.disease), 'Other']);
  }

  private calculateGridPos = (i: number) => {
    return [
      ((i % this.grid.row) + 0.5) * this.grid.width,
      (Math.floor(i / this.grid.row) + 0.5) * this.grid.width,
    ];
  };

  private createScale(): void {
    this.rScale = d3
      .scaleLinear()
      .range([1, 500])
      .domain(this.data.filter((d) => d.value != null).map((d) => d.value));
  }

  private drawChart(): void {
    const countries = this.svg
      .selectAll('.country')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('fill', (d: any) => this.colors(d.disease || 'Other'))
      .attr('fill-opacity', 0.5)
      .attr('r', 8)
      .attr('daeta', (d: any) => this.rScale(d.value))
      .attr(
        'transform',
        (_: any, i: number) => `translate(${this.calculateGridPos(i)})`
      )
      .attr('stroke', (d: any) => this.colors(d.disease || 'Other'))
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
