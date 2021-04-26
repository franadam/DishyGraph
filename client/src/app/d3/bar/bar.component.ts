import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import CountryDictionary from 'src/app/country.interface';

import * as endpointType from 'src/app/endpoint.interface';
import { Hierarchy } from 'src/app/graphData.interface';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit {
  constructor() {}

  @Input() cdata: endpointType.Disease[] = [];
  @Input() cholera: Hierarchy[] = [];
  @Input() malaria: Hierarchy[] = [];
  @Input() measles: Hierarchy[] = [];
  @Input() tuberculosis: Hierarchy[] = [];
  @Input() rubella: Hierarchy[] = [];
  @Input() diphtheria: Hierarchy[] = [];
  @Input() poliomyelitis: Hierarchy[] = [];

  @Input() countries: CountryDictionary = {};

  private data: Hierarchy[] = [];

  private svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private rScale!: d3.ScaleLinear<number, number, never>;
  private graph!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private colors!: d3.ScaleOrdinal<string, string, never>;
  private margin = 50;
  private dims = { width: 1050, height: 1720 };

  ngOnInit(): void {
    this.data = [
      ...this.malaria,
      ...this.cholera,
      ...this.measles,
      ...this.tuberculosis,
      ...this.rubella,
      ...this.diphtheria,
      ...this.poliomyelitis,
    ];
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
      .attr('width', this.dims.width)
      .attr('height', this.dims.height);
    this.graph = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.dims.width / 2 + ',' + this.dims.height / 2 + ')'
      );
  }

  private createColors(): void {
    this.colors = d3
      .scaleOrdinal(d3.schemeSet2)
      .domain([...this.data.map((d: any) => d.disease), 'Other']);
  }

  private createScale(): void {
    this.rScale = d3
      .scaleLinear()
      .range([1, 500])
      .domain(this.data.filter((d) => d.value != null).map((d) => d.value));
  }

  private drawChart(): void {
    const rectWidth = 50;
    const rects = this.svg.selectAll('rect').data(this.malaria);
    rects
      .join('rect')
      .attr('width', rectWidth)
      .attr('fill', 'red')
      .attr('fill-opacity', 0.5)
      .attr('stroke', 'red')
      .attr('x', (d, i) => i * rectWidth)
      .attr('y', (d) => 100 - d.value)
      .attr('height', (d) => d.value);
  }
}
