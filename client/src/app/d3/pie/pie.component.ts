import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

import { Router } from '@angular/router';
import * as graphType from 'src/app/graphData.interface';
import CountryDictionary from 'src/app/country.interface';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
})
export class PieComponent implements OnInit {
  constructor(private router: Router) {}

  @Input() data: graphType.Pie[] = [];
  @Input() countries!: CountryDictionary;
  @Input() title = '';

  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> =
    d3.select('g');
  private yScale: d3.ScaleLinear<number, number, never> = d3.scaleLinear();
  private xScale0: d3.ScaleBand<string> = d3.scaleBand();
  private xScale1: d3.ScaleBand<string> = d3.scaleBand();
  private graph: d3.Selection<SVGGElement, unknown, HTMLElement, any> =
    d3.select('g');
  private colors: d3.ScaleOrdinal<string, string, never> = d3.scaleOrdinal();
  private xAxisGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any> =
    d3.select('g');
  private yAxisGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any> =
    d3.select('g');
  private yAxis: d3.Axis<d3.NumberValue> = d3.axisLeft(this.yScale);
  private xAxis: d3.Axis<string> = d3.axisBottom(this.xScale0);

  private pieGenerator: d3.Pie<any, any> = d3.pie();
  private arcPath: any;
  private paths: any; // d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>;
  private legends: any; // : d3.Selection<d3.BaseType, graphType.Pie, SVGSVGElement, unknown> =  d3.select('g');
  private dims = { height: 200, width: 400, radius: 100 };
  private center = { x: this.dims.width / 2 + 5, y: this.dims.height / 2 + 5 };
  private margin = { height: 100, width: 100 };

  private dataDictionary: { [key: string]: graphType.Pie } = {};

  ngOnInit(): void {
    this.getDictionary();
    this.createGraph();
    this.updateChart();
  }

  ngOnChanges(): void {
    this.getDictionary();
    this.updateChart();
  }

  private getDictionary(): void {
    this.data.forEach((d) => {
      if (d.code) {
        this.dataDictionary[d.code] = d;
      }
    });
    console.log(`this.dataDictionary`, this.dataDictionary);
  }

  private createGraph(): void {
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('width', this.dims.width + this.margin.width)
      .attr('height', this.dims.height + this.margin.height);

    this.graph = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.center.x - this.margin.width / 2}, ${this.center.y})`
      );

    this.pieGenerator = d3
      .pie<any>()
      .sort(null)
      .value((d) => d.value);

    this.arcPath = d3
      .arc()
      .outerRadius(this.dims.radius)
      .innerRadius(this.dims.radius / 2);
  }

  private createColors(): void {
    this.colors = d3
      .scaleOrdinal(d3.schemeSet2)
      .domain(this.data.map((d) => d.name));
  }

  private createLengend(): void {
    this.legends = this.svg
      .selectAll('.legend')
      .data(this.data)
      .join(
        (enter: any) =>
          enter
            .append('g')
            .attr('class', 'legend')
            .attr(
              'transform',
              `translate(${this.dims.width - 2 * this.margin.width}, -50)`
            ),
        (update: any) => update,
        (exit: any) => exit.remove()
      );

    this.legends.exit().remove();

    this.legends
      .selectAll('.dot')
      .data(this.data)
      .join(
        (enter: any) => enter.append('circle').attr('class', 'dot'),
        (update: any) => update,
        (exit: any) => exit.remove()
      )
      .attr('cx', 100)
      .attr('cy', (d: any, i: number) => 100 + i * 25)
      .attr('r', 7)
      .attr('fill', (d: any) => this.colors(d.name));

    this.legends
      .selectAll('.label')
      .data(this.data)
      .join(
        (enter: any) => enter.append('text').attr('class', 'label'),
        (update: any) => update,
        (exit: any) => exit.remove()
      )
      .attr('x', 120)
      .attr('y', (d: any, i: number) => 100 + i * 25)
      .text((d: any) => d.name)
      .attr('fill', '#6F52ED');
  }

  private createScale(): void {
    let yDom: number[] = [];
    const [yMin, yMax] = d3.extent(this.data, (d: graphType.Pie) => d.value);
    if (yMin !== undefined && yMax !== undefined) {
      yDom = [yMin, yMax];
    }
    this.yScale = d3.scaleSqrt().domain(yDom);
  }

  private updateChart(): void {
    const vm = this;
    this.pieGenerator = d3
      .pie<any>()
      .sort(null)
      .value((d) => d.value);

    const angles = this.pieGenerator(
      this.data.map((a) => ({ ...a, value: this.yScale(a.value) }))
    );

    this.createColors();
    this.createScale();
    this.createLengend();
    const paths: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown> =
      this.graph.selectAll('.piece');
    this.paths = paths;

    this.paths.exit().remove();

    // Build the pie chart
    this.paths
      .data(angles)
      .join(
        (enter: any) => enter.append('path').attr('class', 'piece'),
        (update: any) => update,
        (exit: any) => exit.remove()
      )
      .attr('id', (d: any) => d.data.disease)
      .attr('fill', (d: any) => this.colors(d.data.name))
      .attr('fill-opacity', 0.5)
      .attr('stroke', (d: any) => this.colors(d.data.name))
      .style('stroke-width', 2)
      .transition()
      .duration(750)
      .attrTween('d', function(newValues: any, i: any) {
        return vm.arcTween(newValues, i, vm.paths);
      });

    this.paths
      .append('clipPath')
      .attr('id', (d: any) => 'clip_' + d.data.disease)
      .append('use')
      .attr('xlink:href', (d: any) => d.data.disease);

    this.paths
      .append('text')
      .attr('clip-path', (d: any) => 'clip_' + d.data.disease)
      .selectAll('tspan')
      .data((d: any) => d.data)
      .join('tspan')
      .attr('x', 0)
      .attr(
        'y',
        (d: any, i: any, nodes: any) => `${i - nodes.length / 2 + 0.8}em`
      )
      .text((d: any) => d.countryCode)
      .attr('tt', (d: any) => {
        console.log(`d`, d);
        return d.countryCode;
      });

    const clip = (d: any) => `
        <h4 class="clip__title">${d.data.name}</h4>
        <p class="clip__value">${d.data.value} cases</p>
        `;
    this.paths.append('title').html((d: any) => clip(d));

    const clickHandler = (event: any, data: any) => {
      const countryCode = data.data.countryCode;
      this.router.navigateByUrl(`/disease/malaria`);
    };

    this.graph.selectAll('.piece').on('click', clickHandler);
  }

  private arcTween = (newValues: any, i: any, slice: any) => {
    const interpolation = d3.interpolate(slice.storedValues, newValues);
    slice.storedValues = interpolation(0);

    return (t: any) => {
      return this.arcPath(interpolation(t));
    };
  }
}
