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
    need_measure = fields.Boolean(compute='_compute_need_measure', store=True)

    @api.depends('measure_id', 'product_id.measure_form_type')
    @api.one
    def _compute_need_measure(self):
        if self.product_id.measure_form_type and not self.measure_id:
            self.need_measure = True
        else:
            self.need_measure = False

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
    def _prepare_measure(self, line, partner_id):
        res = {
            'product_id': line['product_id'],
            'partner_id': partner_id,
            }
        res.update(line['data'])
        return res

    @api.model
    def _get_partner_from_measure(self):
        return 1

    @api.model
    def _prepare_order_line_from_measure(self, line, partner_id):
        measure = self.env['measure.measure'].create(
            self._prepare_measure(line, partner_id))
        return {
            'product_id': line['product_id'],
            #TODO fix the way to get the qty
            'product_uom_qty': line['data'].get('quantity', 1),
            'measure_id': measure.id,
            }

    @api.model
    def _prepare_order_from_measure(self, vals):
        partner_id = self._get_partner_from_measure()
        return {
            'partner_id': partner_id,
            'order_line': [
                (0, 0, self._prepare_order_line_from_measure(line, partner_id))
                for line in vals['order_line']
                ],
            }

    @api.model
    def set_measure(self, vals):
        if not vals.get('isLocalOnly'):
            for line in vals['order_line']:
                measure_vals = self._prepare_measure(line, vals['partner_id'])
                measure = self.env['measure.measure'].create(measure_vals)
                line = self.env['sale.order.line'].browse(line['line_id'])
                line.write({'measure_id': measure.id})
        else:
            vals = self._prepare_order_from_measure(vals)
            self.create(vals)
        return True

    @api.one
    def _prepare_export_measure_from_order(self):
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
        domain = [
            ['order_line.need_measure', '=', True],
            ]
        return self.search(domain)._prepare_export_measure_from_order()
