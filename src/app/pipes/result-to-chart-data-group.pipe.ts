import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { AggregationResult } from '../interfaces/aggregation-result';
import { ChartData } from '../interfaces/chart-data';
import { SkillService } from '../services/skill.service';
import { ChartDataGroup } from '../interfaces/chart-data-group';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'resultToChartDataGroup',
})
export class ResultToChartDataGroupPipe implements PipeTransform {
  constructor(
    private skillService: SkillService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    console.log('locale:' + locale);
  }

  transform(
    results: AggregationResult[],
    valueType: 'price' | 'vacancy',
    dateFormat = 'yy/MM'
  ): ChartDataGroup[] {
    console.log('resultToChartData');

    const chartDataGroups: ChartDataGroup[] = [];
    results.forEach((result) => {
      let chartDataGroup = chartDataGroups.find(
        (g) => g.name === result.skillId
      );
      if (!chartDataGroup) {
        chartDataGroup = {
          name: result.skillId,
          series: [],
        };
        chartDataGroups.push(chartDataGroup);
      }

      const chartData: ChartData = {
        name: formatDate(result.aggregationDate, dateFormat, this.locale),
        value: this.getChartValue(result, valueType),
      };
      chartDataGroup.series.push(chartData);
    });
    return chartDataGroups;
  }

  private getChartValue(result: AggregationResult, valueType: string): number {
    switch (valueType) {
      case 'price':
        console.log('price');
        return result.price;
      case 'vacancy':
        console.log('vacancy');
        return result.vacancy;
      default:
        return 0;
    }
  }
}
