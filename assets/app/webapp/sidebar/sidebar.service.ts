import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Injectable} from "@angular/core";

@Injectable()
export class SidebarService {

    status = true;

    private _status = new BehaviorSubject<any>(this.status);
    status$ = this._status.asObservable();

    changeStatus(){
        this.status = !this.status;
        this._status.next(this.status);
    }

}