# -*- coding: utf-8 -*-
###############################################################################
#
#   Module for OpenERP
#   Copyright (C) 2014 Akretion (http://www.akretion.com).
#   @author Sébastien BEAU <sebastien.beau@akretion.com>
#
#   This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU Affero General Public License as
#   published by the Free Software Foundation, either version 3 of the
#   License, or (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU Affero General Public License for more details.
#
#   You should have received a copy of the GNU Affero General Public License
#   along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
###############################################################################

from openerp import fields, models, api


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    measure_form_type = fields.Selection(selection='_get_measure_form_type')

    def _get_measure_form_type(self):
        form_list = []
        form = self.env['product.measure']._get_form()
        for key in form.keys():
            form_list.append((key, key))
        return form_list

    @api.one
    def _prepare_measurable_product(self):
        return {
            'name': self.name,
            'form': self.measure_form_type,
            'id': self.id,
            }

    @api.model
    def get_measurable_product(self):
        products = self.search([('measure_form_type', '!=', False)])
        return products._prepare_measurable_product()
