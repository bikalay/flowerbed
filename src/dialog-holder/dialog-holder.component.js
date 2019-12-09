import {appendComponent, registerComponent, ShadowComponent} from "../../../core/component";
import {dialogService} from '../../../services/dialog.service';
import {remove} from "../../../core/dom";
export class DialogHolder extends ShadowComponent {
    static tagName = 't-dialog-holder';
    constructor() {
        super();
        const {backdrop, dialogs} = this._elements;
        dialogService.on('show', component => {
            dialogs.appendChild(component);
            backdrop.style.display = 'block';
        });
        dialogService.on('close', component => {
            if(dialogs.childNodes.length === 0) {
                backdrop.style.display = 'none';
            }
        });
    }
}

registerComponent(DialogHolder);