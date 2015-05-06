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


DATA = {
    'known_order_1': {
        'name': 'SO009',
        'order_line': [
            {
                'edited': True,
                'product_id': 57,
                'form': 'vareuse',
                'line_id': 25,
                'state': 'done',
                'data': {
                    'avance devant': '-1.5',
                    'tissu': 'CPL 300 bleu aviation'
                },
                'product_name': 'veste'
            }, {
                'edited': True,
                'product_id': 58,
                'form': 'PentalonF',
                'line_id': 27,
                'data': {
                    'Hauteur': '36'
                },
                'product_name': 'pantalon'
            },
        ],
        'partner_name': 'Agrolait',
        'terminate': True,
        'state': 'done',
        'partner_matricule': '1234',
        'partner_id': 7,
        'id': 10
        },
    'unknown_order_1': {
        'isLocalOnly': True,
        'order_line': [
            {
                'edited': True,
                'data': {
                    'Hauteur': '36'
                },
                'product_name': 'pantalon',
                'form': 'PentalonF',
                'product_id': 54,
            }, {
                'edited': True,
                'product_id': 58,
                'form': 'PentalonF',
                'line_id': 27,
                'data': {
                    'Hauteur': '36'
                },
                'product_name': 'pantalon'
            },
        ],
        'partner_name': 'existepas',
        'notes': 'notes',
        'terminate': True,
        'state': 'done',
        'partner_matricule': 'pas de matricule',
        'id': 'local532638',
        }
    }


# session.open()
# session.registry('sale.order').set_measure(session.cr, 1, DATA['unknown_order_1'])
# session.cr.commit()
