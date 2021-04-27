import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

import * as graphType from 'src/app/graphData.interface';
import { Disease } from 'src/app/endpoint.interface';
import CountryDictionary  from 'src/app/country.interface';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
})
export class PieComponent implements OnInit {
  constructor() {}

  @Input() data: graphType.Pie[] = [];
  @Input() countries!: CountryDictionary;
  @Input() title: string = '';

  private svg: d3.Selection<
    SVGSVGElement,
    unknown,
    HTMLElement,
    any
  > = d3.select('g');
  private yScale: d3.ScaleLinear<number, number, never> = d3.scaleLinear();
  private xScale0: d3.ScaleBand<string> = d3.scaleBand();
  private xScale1: d3.ScaleBand<string> = d3.scaleBand();
  private graph: d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    any
  > = d3.select('g');
  private colors: d3.ScaleOrdinal<string, string, never> = d3.scaleOrdinal();
  private xAxisGroup: d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    any
  > = d3.select('g');
  private yAxisGroup: d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    any
  > = d3.select('g');
  private yAxis: d3.Axis<d3.NumberValue> = d3.axisLeft(this.yScale);
  private xAxis: d3.Axis<string> = d3.axisBottom(this.xScale0);
  private legends: d3.Selection<SVGGElement, unknown, HTMLElement, any> =
    d3.select('g');

  private dims = { height: 300, width: 700, radius: 150 };
  private center = { x: this.dims.width / 2 + 5, y: this.dims.height / 2 + 5 };
  private margin = { height: 50, width: 100 };

  ngOnInit(): void {
    this.createGraph();
    this.createColors();
    this.createLengend();
    this.drawChart();
    // console.log(`pieData`, this.data);
  }

  private createGraph(): void {
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('width', this.dims.width + this.margin.width)
      .attr('height', this.dims.height + this.margin.height);

    this.graph = this.svg
      .append('g')
      .attr('transform', `translate(${this.center.x}, ${this.center.y})`);
  }

  private createColors(): void {
    this.colors = d3
      .scaleOrdinal(d3.schemeSet2)
      .domain(this.data.map((d) => d.name));
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
      .attr('cy', (d: any, i: number) => 100 + i * 25) 
      .attr('r', 7)
      .attr('fill', (d: any) => this.colors(d.name));

    this.legends
      .selectAll('.label')
      .data(this.data)
      .enter()
      .append('text')
      .attr('x', 120)
      .attr('y', (d: any, i: number) => 100 + i * 25) // 100 is where the first dot appears. 25 is the distance between dots
      .text((d: any) => d.name)
      .attr('fill', '#6F52ED');
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d) => d.value);

    const arcPath: d3.Arc<any, d3.DefaultArcObject> | any = d3
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
      .attr('fill', (d: any) => this.colors(d.data.name))
      .attr('fill-opacity', 0.5)
      .attr('stroke', (d: any) => this.colors(d.data.name))
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
      .attr('fill', (d: any) => this.colors(d.data.name))
      .text((d: any) => d.data.name)
      .attr('transform', (d: any) => `translate(${labelLocation.centroid(d)})`)
      .style('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', 15);
  }
}
