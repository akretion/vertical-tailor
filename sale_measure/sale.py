from openerp import fields, models, api


class SaleLineOrder(models.Model):
    _inherit = 'sale.order.line'

    measure_id = fields.Many2one(
        'measure.measure',
        string="Measure",
        domain="[(('product_id','=',product_id))]")

   