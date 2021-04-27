import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

import CountryDictionary from 'src/app/country.interface';
import { Bar} from 'src/app/graphData.interface';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit {
  constructor() {}

  @Input() countries: CountryDictionary = {};
  @Input() data: Bar[] | any = [];
  @Input() title: string = '';

  private svgDims = { width: 900, height: 500 };
  private margin = { height: 50, width: 50 };
  private graphDims = {
    width: this.svgDims.width - this.margin.width,
    height: this.svgDims.height - this.margin.height,
  };
  private diseases: string[] = [];
  private transition = 1500;
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
  private legends!: d3.Selection<
    SVGGElement | d3.BaseType,
    string,
    SVGGElement,
    unknown
  >;

  ngOnInit(): void {
    this.createSvg();
    this.createColors();
    this.createScale();
    this.createAxis();
    this.createLegend();
    this.drawChart();
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
        `translate(${this.margin.width},  ${this.margin.height / 2})`
      );
  }

  private createColors(): void {
    this.diseases = this.data.columns.slice(1);
    this.colors = d3.scaleOrdinal(d3.schemeSet2).domain(this.diseases);
  }

  private createScale(): void {
    this.xScale0 = d3
      .scaleBand()
      .rangeRound([this.margin.width, this.graphDims.width])
      .paddingInner(0.05)
      .domain(this.data.map((d: Bar) => d.year.toString()));

    this.xScale1 = d3
      .scaleBand()
      .rangeRound([0, this.xScale0.bandwidth()])
      .padding(0.5)
      .domain(this.diseases);

    const y_dom = [
      1,
      d3.max(this.data, (d: Bar) => d3.max(this.diseases, (key) => d[key])) ||
        45000,
    ];
    this.yScale = d3
      .scaleSqrt()
      .range([this.graphDims.height, 1])
      .domain(y_dom);
  }

  private createAxis(): void {
    this.xAxisGroup = this.graph.append('g');

    this.yAxisGroup = this.graph.append('g');

    this.xAxis = d3.axisBottom(this.xScale0);
    this.yAxis = d3.axisLeft(this.yScale).ticks(null, 's');
    //.tickFormat((d) => d + ' cases')
  }

  private createLegend(): void {
    this.legends = this.svg.append('g')
      .attr('transform', `translate(${this.graphDims.width - this.margin.width},0)`)
      .attr('font-family', 'sans-serif')
      .selectAll('.legend')
      .data(this.colors.domain().slice().reverse())
      .join('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    this.legends
      .append('rect')
      .attr('x', -24)
      .attr('width', 16)
      .attr('height', 16)
      .attr('fill', this.colors);

    this.legends
      .append('text')
      .style('text-transform', 'capitalize')
      .attr('y', 9.5)
      .attr('dy', '0.35em')
      .text((d) => d);
  }

  private drawChart(): void {
    const years = this.graph
      .selectAll('.year')
      .data(this.data)
      .join('g')
      .attr(
        'transform',
        (d: any) => `translate(${this.xScale0(d.year.toString())},0)`
      )
      .attr('year', (d: any) => d.year);
    const rects = years
      .selectAll('rect')
      .data((d: any) => this.diseases.map((key) => ({ key, value: d[key] })))
      .join((enter) => {
        return enter
          .append('rect')
          .attr('width', 0)
          .attr('heigtht', 1)
          .attr('y', this.graphDims.height - this.margin.height / 2);
      })
      .attr('fill', (d) => this.colors(d.key))
      .attr('fill-opacity', 0.5)
      .attr('stroke', (d) => this.colors(d.key))
      .attr('x', (d, i) => this.xScale1(d.key) || 0)
      .transition()
      .duration(this.transition)
      .attr('y', (d) => this.yScale(d.value || 1))
      .attr('width', this.xScale1.bandwidth())
      .attr('height', (d) => this.yScale(1) - this.yScale(d.value || 1));

      this.graph.call(() => this.legends)
    this.xAxisGroup
      .call(this.xAxis)
      .attr('transform', `translate(0, ${this.graphDims.height})`)
      .selectAll('.tick text')
      .attr('transform', 'rotate(-40)')
      .attr('text-anchor', 'end');

    this.yAxisGroup
      .call(this.yAxis)
      .attr('transform', `translate(${this.margin.width}, 0)`)
      .call((g) =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', -this.data.yAxisTitle.length * 16 * 1.2)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .attr('font-size', '1.2rem')
          .text(this.data.yAxisTitle)
      );
  }
}
