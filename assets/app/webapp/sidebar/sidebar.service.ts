import {Subject} from "rxjs";

export class SidebarService {
    private _subject = new Subject<any>();

    newEvent(event:string){
        this._subject.next(event);
    }

    get events(){
        return this._subject.asObservable();
    }
}