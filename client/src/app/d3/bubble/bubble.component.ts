import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3 from 'd3';

import CountryDictionary from 'src/app/country.interface';
import { Hierarchy } from 'src/app/graphData.interface';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css'],
})
export class BubbleComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  @Input() data: Hierarchy[] = [];
  @Input() countries: CountryDictionary = {};

  private svgDims = { width: 1000, height: 450 };
  private margin = { height: 10, width: 10 };
  private graphDims = {
    width: this.svgDims.width - this.margin.width,
    height: this.svgDims.height - this.margin.height,
  };
  private grid = { row: 10, width: 80 };

  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> =
    d3.select('g');
  private rScale!: d3.ScaleLinear<number, number, never>;
  private graph: d3.Selection<SVGGElement, unknown, HTMLElement, any> =
    d3.select('g');
  private colors!: d3.ScaleOrdinal<string, string, never>;
  private root!: d3.HierarchyCircularNode<unknown>; // = d3.hierarchy(this.data);
  private legends: d3.Selection<SVGGElement, unknown, HTMLElement, any> =
    d3.select('g');
  private transition = 3000;

  ngOnInit(): void {
    this.createSvg();
    this.createColors();
    this.createPack();
    this.createScale();
    this.createLengend();
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

  private createPack(): void {
    const pack = (data: Hierarchy[]) =>
      d3
        .pack()
        .size([this.graphDims.width - 2, this.graphDims.height - 2])
        .padding(3)(d3.hierarchy({ children: data }).sum((d: any) => d.value));
    this.root = pack(this.data);
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

  private createLengend(): void {
    const diseases = [...new Set(this.data.map((d) => d.disease))];
    this.legends = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.svgDims.width - this.svgDims.height / 2}, ${
          this.graphDims.height / 2
        })`
      );

    this.legends
      .selectAll('.dot')
      .data(diseases)
      .enter()
      .append('circle')
      .attr('cx', 100)
      .attr('cy', (d: string, i: number) => 100 + i * 25)
      .attr('r', 8)
      .attr('fill', (d: string) => this.colors(d));

    this.legends
      .selectAll('.label')
      .data(diseases)
      .enter()
      .append('text')
      .attr('x', 120)
      .attr('y', (d: string, i: number) => 105 + i * 25)
      .text((d: string) => d)
      .attr('font-family', 'sans-serif')
      .style('text-transform', 'capitalize');
  }

  private drawChart(): void {
    const countries: any = this.graph
      .selectAll('.country')
      .data(this.root.leaves())
      .join((enter) => {
        return enter
          .append('g')
          .attr(
            'transform',
            (_: any, i: number) => `translate(${this.calculateGridPos(i)})`
          );
      });
    countries
      .transition()
      .duration(this.transition)
      .attr('transform', (d: any) => `translate(${d.x + 1},${d.y + 1})`);

    countries
      .append('circle')
      .attr('id', (d: any) => d.data.disease + d.data.countryCode)
      .attr('fill', (d: any) => this.colors(d.data.disease))
      .attr('r', 8)
      .attr('fill-opacity', 0.5)
      .attr('stroke', (d: any) => this.colors(d.data.disease))
      .style('stroke-width', 1)
      .transition()
      .duration(this.transition)
      .attr('r', (d: any) => d.r);

    countries
      .append('clipPath')
      .attr('id', (d: any) => 'clip_' + d.data.disease + d.data.countryCode)
      .append('use')
      .attr('xlink:href', (d: any) => d.data.disease + d.data.countryCode);

    countries
      .append('text')
      .attr(
        'clip-path',
        (d: any) => 'clip_' + d.data.disease + d.data.countryCode
      )
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
        <h4 class="clip__title">${d.data.countryName}</h4>
        <p class="clip__disease"><span>${d.data.disease}</span>: ${d.data.value} cases</p>
        `;
    countries.append('title').html((d: any) => clip(d));

    // add events

    const clickHandler = (event: any, data: any) => {
      const countryCode = data.data.countryCode;
      this.router.navigateByUrl(`/country/${countryCode}`);
    };

    this.graph.selectAll('circle').on('click', clickHandler);
    //.on('mouseover', mouseOverHandler)
    //.on('mouseout', mouseOutHandler)
  }
}
