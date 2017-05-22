import {Component, OnInit} from "@angular/core";
import { GoogleChartComponent} from './googlechart.component';
import {Title} from "@angular/platform-browser";


@Component({
    selector: 'webapp-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css']
})
export class TasksComponent extends GoogleChartComponent {

    private options;
    private data;
    private chart;

    titleService = new Title("");

    drawGraph(){
        this.data = this.createDataTable([
            ['Task ID', 'Task Name', 'Start Date','End Date','Duration','Percent Complete','Dependencies'],
            ['Research', 'Find sources', new Date(2015, 0, 1), new Date(2015, 0, 5), null,  100,  null],
            ['Write', 'Write paper', null, new Date(2015, 0, 9), this.daysToMilliseconds(3), 25, 'Research,Outline'],
            ['Cite', 'Create bibliography', null, new Date(2015, 0, 7), this.daysToMilliseconds(1), 20, 'Research'],
            ['Complete', 'Hand in paper', null, new Date(2015, 0, 10), this.daysToMilliseconds(1), 0, 'Cite,Write'],
            ['Outline', 'Outline paper', null, new Date(2015, 0, 6), this.daysToMilliseconds(1), 100, 'Research']
        ]);

        this.options = {
            height: 275,
            gantt: {
                criticalPathEnabled: false,
                criticalPathStyle: {
                    stroke: '#e64a19',
                    strokeWidth: 5
                }
            }
        };

        this.chart = this.createGanttChart(document.getElementById('chart_div'));
        this.chart.draw(this.data, this.options);

        this.titleService.setTitle("My Tasks");
    }

    daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
    }

    onResize(event){
        this.drawGraph();
    }

    ngOnDestroy(){
        this.titleService.setTitle("Project Management");
    }
}