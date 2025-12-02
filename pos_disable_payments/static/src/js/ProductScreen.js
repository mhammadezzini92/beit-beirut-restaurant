/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { _t } from "@web/core/l10n/translation";
import { Component, onMounted, useState } from "@odoo/owl";

patch(ProductScreen.prototype, {
    setup() {
        super.setup();
        this.pos = usePos();
        this._onKeyDown = this._onKeyDown.bind(this);
        onMounted(() => {
            document.addEventListener("keydown", this._onKeyDown);
        });
    },
    _onKeyDown(event) {
        const cashier = this.pos.get_cashier();

        if (!cashier.is_allow_remove_orderline && event.key === "Backspace") {
            alert('You are not allowed to modify order line !!!');
            event.preventDefault(); 
        }
    },
    getNumpadButtons() {
        return [
            { value: "1" , disabled: !this.pos.get_cashier().is_allow_numpad },
            { value: "2" , disabled: !this.pos.get_cashier().is_allow_numpad},
            { value: "3" , disabled: !this.pos.get_cashier().is_allow_numpad},
            { value: "quantity", text: "Qty" , disabled: !this.pos.get_cashier().is_allow_qty},
            { value: "4" , disabled: !this.pos.get_cashier().is_allow_numpad},
            { value: "5" , disabled: !this.pos.get_cashier().is_allow_numpad},
            { value: "6" , disabled: !this.pos.get_cashier().is_allow_numpad},
            { value: "discount", text: "% Disc", disabled: !this.pos.config.manual_discount ||  !this.pos.get_cashier().is_allow_discount },
            { value: "7" , disabled: !this.pos.get_cashier().is_allow_numpad},
            { value: "8" , disabled: !this.pos.get_cashier().is_allow_numpad},
            { value: "9" , disabled: !this.pos.get_cashier().is_allow_numpad},
            { value: "price", text: "Price", disabled: !this.pos.cashierHasPriceControlRights() || !this.pos.get_cashier().is_edit_price },
            { value: "-", text: "+/-" , disabled: !this.pos.get_cashier().is_allow_plus_minus_button},
            { value: "0" , disabled: !this.pos.get_cashier().is_allow_numpad},
            { value: this.env.services.localization.decimalPoint , disabled: !this.pos.get_cashier().is_allow_numpad},
            // Unicode: https://www.compart.com/en/unicode/U+232B
            { value: "Backspace", text: "⌫" , disabled: !this.pos.get_cashier().is_allow_remove_orderline},
        ].map((button) => ({
            ...button,
            class: this.pos.numpadMode === button.value ? "active border-primary" : "",
        }));
    }
});
