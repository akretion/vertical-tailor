# -*- coding: utf-8 -*-
# Copyright (C) 2015-Today Akretion
# @author Abdessamad HILALI <abdessamad.hilali@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
{
    'name': "Sale measure",
    'description': "Sale measure for tailor",
    'website': "http://www.akretion.com",
    'license': 'AGPL-3',
    'author': "Akretion,Odoo Community Association (OCA)",
    'category': 'sale',
    'version': '10.0.1.0.1',
    'depends': [
        'sale',
        'sale_exception',
        ],
    'data': [
        'views/measure.xml',
        'views/partner_measure.xml',
        'views/partner.xml',
        'views/product.xml',
        'views/sale.xml',
        'data/data.xml',
        'security/ir.model.access.csv'
    ],
    # only loaded in demonstration mode
    'demo': [],
    'external_dependencies': {
        'python': ['lxml'],
    }

}
