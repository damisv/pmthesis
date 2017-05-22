import { Component, OnInit} from '@angular/core';
declare var google:any;
@Component({
    selector: 'chart'
})
export class GoogleChartComponent implements OnInit {
    private static googleLoaded:any;

    constructor(){
    }

    getGoogle() {
        return google;
    }
    ngOnInit() {
        if(!GoogleChartComponent.googleLoaded) {
            GoogleChartComponent.googleLoaded = true;
            google.charts.load('current',  {packages: ['corechart', 'bar', 'gantt']});
        }
        google.charts.setOnLoadCallback(() => this.drawGraph());
    }

    drawGraph(){
    }

    createGanttChart(element:any) :any{
        return new google.visualization.Gantt(element);
    }

    createBarChart(element:any):any {
        return new google.visualization.BarChart(element);
    }

    createDataTable(array:any[]):any {
        return google.visualization.arrayToDataTable(array);
    }

}