# -*- coding: utf-8 -*-
# Copyright (C) 2015-Today Akretion
# @author Abdessamad HILALI <abdessamad.hilali@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

{

    'name': "Sale measure demo",

    'summary': """Manage trainings""",
    'description': """
            Sale measure Demo
    """,
    'author': "Akretion",
    'website': "http://www.akretion.com",
    'license': 'AGPL-3',
    'category': 'Measure ',
    'version': '10.0.1.0.0',
    'depends': ['sale_measure'],
    'data': [
        'measure_demo.xml'
    ],
    'demo': [
        'tests/sale_measure_demo.xml'
        # 'demo/measure_demo.xml',
        # 'demo/res.partner.csv',
        # 'demo/product.product.csv'
        ],
}
