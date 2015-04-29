"""
Sale line Class there is a link with measure Class

"""
from openerp import fields, models


class SaleLineOrder(models.Model):
    """ Sale Line Order """
    _inherit = 'sale.order.line'

    measure_id = fields.Many2one(
        'measure.measure',
        string="Measure",
        domain="[(('product_id','=',product_id))]")
