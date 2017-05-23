export class Task {
    constructor(public project_id: string,
                public assigner_email: string,
                public name:string,
                public description?:string,
                public assignee_email?: String[],
                private dependency?: String[],
                public date_start?:string,
                public date_end?:string,
                public completed?:string,
                public _id?:string
                ) {}
}