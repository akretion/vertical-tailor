# -*- coding: utf-8 -*-
# Copyright (C) 2015-Today Akretion
# @author Abdessamad HILALI <abdessamad.hilali@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from odoo import fields, models, api, _


class Partner(models.Model):
    _inherit = "res.partner"

    measure_ids = fields.One2many('partner.measure', 'partner_id',
        domain=['|', ('active', '=', False), ('active', '=', True)])
    product_measure_ids = fields.One2many('product.measure', 'partner_id')


class PartnerMeasure(models.Model):
    _name = "partner.measure"
    _order = "date desc, id desc"

    @api.depends('partner_id.measure_ids.date')
    @api.one
    def _is_active(self):
        if self.partner_id.measure_ids[0] != self:
            if self.active:
                self.active = False
        else:
            if not self.active:
                self.active = True

    partner_id = fields.Many2one(
        'res.partner',
        string="partner",
        required=True)
    date = fields.Date("Date", default=fields.datetime.now(), required=True)
    active = fields.Boolean("Active", compute=_is_active, store=True)
    stature = fields.Float("Stature", form=True)
    weight = fields.Float("Weight", form=True)
    chest_size = fields.Float("Chest size", form=True)
    waistline = fields.Float("Waistline", form=True)
    head_size = fields.Float("Head Size", form=True)
    leg_length = fields.Float("Leg length", form=True)
    crotch = fields.Float("Crotch", form=True)
    pelvis_size = fields.Float("Pelvis Size", form=True)

    def _get_form(self):
        res = {
            'group_title': '',
            'questions' : [],
            }
        for field_name, field in self._fields.items():
            if hasattr(field, 'form') and field.form:
                res['questions'].append({
                    'name': field_name,
                    'widget': 'numeric',
                    'label': field.get_description(self.env)['string'],
                    })
        return [res]
