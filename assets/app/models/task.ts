export class Task {
    constructor(public project_id: string,
                public project_name: string,
                public assigner_email: string,
                public name:string,
                public description?:string,
                public assignee_email?: String[],
                public dependencies?: Array<dependcy>,
                public date_created?:Date,
                public date_start?:Date,
                public date_end?:Date,
                public completed?:boolean,
                public _id?:string
                ) {}
}

class dependcy{
    constructor(public taskID: string,
                public name: string,
                public type: string,
    ) {}
}