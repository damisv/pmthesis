export class Member{
    constructor(public position:string,
    public email:string,
    public status?:string){}
}

export class Project {
    constructor(
        public name: string,
        public _id?:string,
        public team?:Member[],
        public company?:string,
        public budget?:number,
        public typeOf?:string,
        public description?:string
    ) {}
}