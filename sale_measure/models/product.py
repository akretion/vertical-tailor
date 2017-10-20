# -*- coding: utf-8 -*-
# Copyright (C) 2014-Today Akretion
# @author Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).


from odoo import fields, models, api


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    measure_form_type = fields.Selection(string='Measure Form Type',
                                         selection='_get_measure_form_type')

    def _get_measure_form_type(self):
        form_list = []
        form = self.env['product.measure']._get_form()
        for key in form.keys():
            form_list.append((key, key))
        return form_list

    @api.multi
    def _prepare_measurable_product(self):
        for record in self:
            return {
                'name': record.name,
                'form': record.measure_form_type,
                'id': record.id,
                }

    @api.model
    def get_measurable_product(self):
        products = self.search([('measure_form_type', '!=', False)])
        return products._prepare_measurable_product()
