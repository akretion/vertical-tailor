from openerp import fields, models, api


class SaleLineOrder(models.Model):
    _inherit = 'sale.order.line'
    _name = 'sale.order.line'

    measure_id = fields.Many2one(
        'measure.measure',
        string="Measure",
        domain="[(('product_id','=',product_id))]")

    @api.one
    def _prepare_order_line_measure(self):
        return {
            'product_name': self.product_id.name,
            'product_id': self.product_id.id,
            'form': self.product_id.measure_form_type,
            'line_id': self.id,
            }


class SaleOrder(models.Model):
    _inherit = 'sale.order'

    @api.model
    def set_measure(self, vals):
        print vals
        return True

    @api.one
    def _prepare_order_measure(self):
        return {
            'id': self.id,
            'name': self.name,
            'partner_name': self.partner_id.name,
            'partner_matricule': '1234',
            'partner_id': self.partner_id.id,
            'order_line': self.order_line._prepare_order_line_measure(),
            }

    @api.model
    def get_measure(self):
        domain = [['order_line.product_id.measure_form_type', '!=', False]]
        return self.search(domain)._prepare_order_measure()
