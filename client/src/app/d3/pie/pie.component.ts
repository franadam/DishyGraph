import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import Disease from '../../disease.interface';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
})
export class PieComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.createSvg();
    this.createColors();
    this.createLengend();
    this.drawChart();
  }

  @Input() data: Disease[] = [];
  @Input() countries: any;

  private svg: any;
  private graph: any;
  private legends: any;
  private dims = { height: 300, width: 700, radius: 150 };
  private center = { x: this.dims.width / 2 + 5, y: this.dims.height / 2 + 5 };
  private margin = 150;
  private colors: any;

  private createSvg(): void {
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('width', this.dims.width + this.margin)
      .attr('height', this.dims.height + this.margin);

    this.graph = this.svg
      .append('g')
      .attr('transform', `translate(${this.center.x}, ${this.center.y})`);
  }

  private createColors(): void {
    this.colors = d3
      .scaleOrdinal(d3['schemeSet3'])
      .domain([
        ...this.data.map((d) => this.countries[d.SpatialDim].ParentTitle),
        'Other',
      ]);
  }

  private createLengend(): void {
    this.legends = this.svg
      .append('g')
      .attr('transform', `translate(${this.dims.width - 140}, 10)`);

    this.legends
      .selectAll('.dot')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('cx', 100)
      .attr('cy', (d: Disease, i: number) => 100 + i * 25) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('r', 7)
      .attr('fill', (d: Disease) =>
        this.colors(this.countries[d.SpatialDim].ParentTitle || 'Other')
      );

    this.legends
      .selectAll('.label')
      .data(this.data)
      .enter()
      .append('text')
      .attr('x', 120)
      .attr('y', (d: Disease, i: number) => 100 + i * 25) // 100 is where the first dot appears. 25 is the distance between dots
      .text(
        (d: Disease) => this.countries[d.SpatialDim].ParentTitle || d.SpatialDim
      )
      .attr('fill', '#6F52ED');
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d) => d.NumericValue);

    const arcPath = d3
      .arc()
      .outerRadius(this.dims.radius)
      .innerRadius(this.dims.radius / 2);

    const angles = pie(this.data);
    const paths = this.graph.selectAll('.piece').data(angles);

    // Build the pie chart
    paths
      .enter()
      .append('path')
      .attr('d', arcPath)
      .attr('fill', (d: any) =>
        this.colors(this.countries[d.data.SpatialDim].ParentTitle || 'Other')
      )
      .attr('stroke', '#121926')
      .style('stroke-width', 2);

    // Add labels
    const labelLocation = d3
      .arc()
      .innerRadius(100)
      .outerRadius(this.dims.radius);

    paths
      .selectAll('pieces')
      .data(angles)
      .enter()
      .append('text')
      .text((d: any) => d.data.Framework)
      .attr(
        'transform',
        (d: any) => `translate(${labelLocation.centroid(d)})`
      )
      .style('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', 15);
  }
}
