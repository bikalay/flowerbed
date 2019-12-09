import {registerComponent, ShadowComponent} from "../../../core/component";
import {remove} from "../../../core/dom";
import {dialogService} from "../../../services/dialog.service";

export class Dialog extends ShadowComponent {
    static tagName = 't-dialog';
    constructor() {
        super();
    }
    close(result) {
        if(this._resolve) {
            this._resolve(result);
        }
        remove(this, this.parentNode);
        dialogService.closeDialog(this);
    }
    result() {
        return new Promise(resolve => {
            this._resolve = resolve;
        });
    }
}
registerComponent(Dialog);