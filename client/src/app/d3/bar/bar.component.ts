import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import CountryDictionary from 'src/app/country.interface';
import Disease from 'src/app/disease.interface';

import * as endpointType from 'src/app/endpoint.interface';
import { Hierarchy } from 'src/app/graphData.interface';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit {
  constructor() {}

  @Input() countries: CountryDictionary = {};
  @Input() data: Disease[] = [];

  title = 'hello bar';

  private svgDims = { width: 720, height: 400 };
  private margin = { height: 50, width: 100 };
  private graphDims = {
    width: this.svgDims.width - 2 * this.margin.width,
    height: this.svgDims.height - 2 * this.margin.height,
  };
  private transition = 1500;
  private svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private yScale!: d3.ScaleLinear<number, number, never>;
  private xScale!: d3.ScaleBand<string>;
  private graph!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private colors!: d3.ScaleOrdinal<string, string, never>;
  private xAxisGroup!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private yAxisGroup!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private yAxis!: d3.Axis<d3.NumberValue>;
  private xAxis!: d3.Axis<string>;

  ngOnInit(): void {
    this.createSvg();
    this.createColors();
    this.createScale();
    this.createAxis();
    this.drawChart();
    console.log(`bar data`, this.data);
    console.log(
      `bar data map`,
      this.data.filter((d) => d.value != null).map((d) => d.value)
    );
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.svgDims.width)
      .attr('height', this.svgDims.height);
    this.graph = this.svg
      .append('g')
      .attr('width', this.graphDims.width)
      .attr('height', this.graphDims.height)
      .attr(
        'transform',
        `translate(${this.margin.width},  ${this.margin.height})`
      );
  }

  private createColors(): void {
    this.colors = d3
      .scaleOrdinal(d3.schemeSet2)
      .domain(this.data.map((d: any) => d.disease));
  }

  private createScale(): void {
    this.xScale = d3
      .scaleBand(this.data.filter((d) => d.value != null).map((d) => d.time))
      .range([0, this.graphDims.width])
      .paddingInner(0.3)
      .paddingOuter(1)
      .domain(
        this.data.filter((d) => d.value != null).map((d) => d.time.toString())
      );
    this.yScale = d3
      .scaleLinear()
      .range([this.graphDims.height, 0])
      .domain([0, Math.max(...this.data.filter((d) => d.value != null).map((d) => d.value))]);
  }

  private createAxis(): void {
    this.xAxisGroup = this.graph
      .append('g')
      .attr('transform', `translate(0, ${this.graphDims.height})`);

    this.xAxisGroup
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .attr('text-anchor', 'end')
      .attr('fill', 'orange');

    this.yAxisGroup = this.graph.append('g');

    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3
      .axisLeft(this.yScale)
      .tickFormat((d) => d + ' case');
  }

  private drawChart(): void {
    const rectWidth = this.xScale.bandwidth();
    console.log(`rectWidth`, rectWidth)
    const rects = this.graph.selectAll('rect').data(this.data);
    rects
      .join((enter) => {
        return enter
          .append('rect')
          .attr('width', 0)
          .attr('heigtht', 0)
          .attr('y', this.graphDims.height);
      })
      .attr('fill', 'red')
      .attr('fill-opacity', 0.5)
      .attr('stroke', 'red')
      .attr('x', (d, i) => this.xScale(d.time.toString()) || 0 )
      .transition()
      .duration(this.transition)
      .attr('y', (d) => this.yScale(d.value))
      .attr('width', this.xScale.bandwidth())
      .attr('height', (d) => this.graphDims.height - this.yScale(d.value));

    this.xAxisGroup.call(this.xAxis);
    this.yAxisGroup.call(this.yAxis);
  }
}
