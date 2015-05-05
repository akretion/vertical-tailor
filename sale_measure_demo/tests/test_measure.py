

# -*- coding: utf-8 -*-
##############################################################################
#
#    Copyright (C) All Rights Reserved 2015 Akretion
#    @author Abdessamad HILALI <abdessamad.hilali@akretion.com>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
###############################################################################
import openerp.tests.common as common
from lxml import etree
import ast

class TestNewSource(common.TransactionCase):
    """ Class TestNewSource"""
    _inherit = "measure.measure"

    def setUp(self):
        super(TestNewSource, self).setUp()
        self.measure_measure_model = self.env['measure.measure']
        self.product_product_model = self.env['product.product']

    def test_measure(self):
        product_id = self.product_product_model.create(
            {
                'measure_form_type': 'vareuse_homme_lot1',
                'name': 'Vareuse'
                })
        try:
            find_error = False
            self.measure_measure_model.create(
                {
                    'tested_size': 25,
                    'basin_LBA': -1,
                    'half_width_belt_PCE': -3.5,
                    'amount_before_PDE': -2,
                    'length_dimension_PLO': 'EN+',
                    'product_id': product_id
                    })
        except:
            find_error = True
        self.assertEqual(find_error, True)

    def test_fields_view_get(self):
        xml_file = self.measure_measure_model.fields_view_get()
        invisi_list = self.measure_measure_model._prepare_list_for_invisible()
        root = etree.fromstring(xml_file['arch'])
        for field in root.findall(".//field"):
            if 'attrs' in field.attrib.keys():
                str_to_dict_element = ast.literal_eval(field.attrib['attrs'])
                self.assertEqual(invisi_list[field.attrib['name']],
                                 str_to_dict_element['invisible'][-1][-1])
