/** @odoo-module **/

import { useComponentToModel } from '@mail/component_hooks/use_component_to_model';
import { useRefToModel } from '@mail/component_hooks/use_ref_to_model';
import { useUpdateToModel } from '@mail/component_hooks/use_update_to_model';
import { registerModel } from '@mail/model/model_core';
import { attr, one } from '@mail/model/model_field';

registerModel({
    name: 'ComposerTextInputView',
    template: 'mail.ComposerTextInputView',
    templateGetter: 'composerTextInputView',
    componentSetup() {
        useComponentToModel({ fieldName: 'component' });
        useRefToModel({ fieldName: 'mirroredTextareaRef', refName: 'mirroredTextarea' });
        useRefToModel({ fieldName: 'textareaRef', refName: 'textarea' });
        /**
         * Updates the composer text input content when composer is mounted
         * as textarea content can't be changed from the DOM.
         */
        useUpdateToModel({ methodName: 'onComponentUpdate' });
    },
    recordMethods: {
        onComponentUpdate() {
            if (!this.component.root.el) {
                return;
            }
            if (this.owner.doFocus) {
                this.owner.update({ doFocus: false });
                if (this.messaging.device.isSmall) {
                    this.component.root.el.scrollIntoView();
                }
                this.textareaRef.el.focus();
            }
            if (this.owner.hasToRestoreContent) {
                this.textareaRef.el.value = this.owner.composer.textInputContent;
                if (this.owner.isFocused) {
                    this.textareaRef.el.setSelectionRange(
                        this.owner.composer.textInputCursorStart,
                        this.owner.composer.textInputCursorEnd,
                        this.owner.composer.textInputSelectionDirection,
                    );
                }
                this.owner.update({ hasToRestoreContent: false });
            }
            this.owner.updateTextInputHeight();
        },
    },
    fields: {
        component: attr(),
        /**
         * This is the invisible textarea used to compute the composer height
         * based on the text content. We need it to downsize the textarea
         * properly without flicker.
         */
        mirroredTextareaRef: attr(),
        owner: one('ComposerView', { identifying: true, inverse: 'textInput' }),
        /**
         * Reference of the textarea. Useful to set height, selection and
         * content.
         */
        textareaRef: attr(),
    },
});
