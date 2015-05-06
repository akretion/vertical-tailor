

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
        self.sale_order_model = self.env['sale.order']
        self.res_partner_id = self.env[
            'ir.model.data'
            ].get_object_reference(
            "sale_measure_demo",
            "res_partner_measure")[1]
        self.product_product_id = self.env[
            'ir.model.data'
            ].get_object_reference(
            "sale_measure_demo",
            "product_product_measure")[1]
        self.sale_order_id = self.env[
            'ir.model.data'
            ].get_object_reference(
            "sale_measure_demo",
            "sale_order_measure")[1]
        self.sale_order_line_id = self.env[
            'ir.model.data'
            ].get_object_reference(
            "sale_measure_demo",
            "sale_order_line_measure")[1]

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

    def data_connect(self):
        return {
            'name': 'SO009',
            'order_line': [
                {
                    'edited': True,
                    'product_id': self.product_product_id,
                    'form': 'vareuse',
                    'line_id': self.sale_order_line_id,
                    'state': 'done',
                    'data': {
                        'shoulder_width_LEP': '-1.5',
                    },
                    'product_name': 'veste'
                }, {
                    'edited': True,
                    'product_id': self.product_product_id,
                    'form': 'PentalonF',
                    'line_id': self.sale_order_line_id,
                    'data': {
                        'shoulder_width_LEP': '-1.5',
                    },
                    'product_name': 'pantalon'
                },
            ],
            'partner_name': 'Agrolait',
            'terminate': True,
            'state': 'done',
            'partner_matricule': '1234',
            'partner_id': self.res_partner_id,
            'id': self.sale_order_id
        }

    def data_localOnly(self):
        return {
            'isLocalOnly': True,
            'order_line': [
                {
                    'edited': True,
                    'data': {
                        'tested_size': '36'
                    },
                    'product_name': 'pantalon',
                    'form': 'PentalonF',
                    'product_id': self.product_product_id,
                }, {
                    'edited': True,
                    'product_id': self.product_product_id,
                    'form': 'PentalonF',
                    'data': {
                        'tested_size': '36'
                    },
                    'product_name': 'pantalon'
                },
            ],
            'partner_name': 'existepas',
            'notes': 'notes',
            'terminate': True,
            'state': 'done',
            'partner_matricule': 'pas de matricule',
        }

    def test_set_measure_connect(self):
        connect = self.data_connect()
        self.assertEqual(self.sale_order_model.set_measure(connect), True)
        print '--- Connect OK---- '

    def test_set_measure_localOnly(self):
        localOnly = self.data_localOnly()
        self.assertEqual(self.sale_order_model.set_measure(localOnly), True)
        print '--- localOnly OK---- '
