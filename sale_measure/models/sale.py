"""
Sale line Class there is a link with measure Class

"""
from openerp import fields, models, api
from openerp.exceptions import Warning


class SaleLineOrder(models.Model):
    """ Sale Line Order """
    _inherit = 'sale.order.line'

    measure_id = fields.Many2one(
        'product.measure',
        string="Measure",
        domain="[(('product_id','=',product_id))]")
    need_measure = fields.Boolean(compute='_compute_need_measure', store=True)

    # It seem that calling with new API fail
    def copy_data(self, cr, uid, id, default=None, context=None):
        if not default:
            default = {}
        default['measure_id'] = False
        return super(SaleLineOrder, self).copy_data(
            cr, uid, id, default=default, context=context)

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
            'qty': self.product_uom_qty,
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
    def _get_partner_domain(self, vals):
        return [('ref', '=', vals['partner_matricule'])]

    @api.model
    def _get_partner_from_measure(self, vals):
        partner_obj = self.env['res.partner']
        if vals['partner_matricule']:
            domain = self._get_partner_domain(vals)
            partner = partner_obj.search(domain)
            if len(partner) == 1:
                return partner
            elif len(partner) > 1:
                raise Warning('Too many partner found for the reference %s')
        return partner_obj.create({
            'name': vals['partner_name'],
            'ref': vals['partner_matricule'],
            })

    @api.model
    def _get_product(self, line):
        tmpl = self.env['product.template'].browse(line['product_tmpl_id'])
        return tmpl.product_variant_ids[0].id

    @api.model
    def _prepare_order_line_from_measure(self, line, partner_id):
        #TODO be more explicite, use product_tmpl_id
        line['product_tmpl_id'] = line['product_id']
        line['product_id'] = self._get_product(line)
        measure = self.env['product.measure'].create(
            self._prepare_measure(line, partner_id))
        return {
            'product_id': line['product_id'],
            #TODO fix the way to get the qty
            'product_uom_qty': line['data'].get('qty', 1),
            'measure_id': measure.id,
            }

    @api.model
    def _prepare_order_from_measure(self, vals):
        partner = self._get_partner_from_measure(vals)
        return {
            'partner_id': partner.id,
            'order_line': [
                (0, 0, self._prepare_order_line_from_measure(line, partner.id))
                for line in vals['order_line']
                ],
            }

    @api.one
    def set_partner_measure(self, vals):
        partner_measure_obj = self.env['partner.measure']
        domain = [('partner_id', '=', self.partner_id.id)]
        for field_name, field in partner_measure_obj._columns.items():
            if hasattr(field, 'form') and field.form:
                domain.append((field_name, '=', vals.get(field_name)))
        if not partner_measure_obj.search(domain):
            vals['partner_id'] = self.partner_id.id
            partner_measure_obj.create(vals)
        return True

    @api.model
    def set_measure(self, vals):
        if not vals.get('isLocalOnly'):
            sale_order = None
            for line in vals['order_line']:
                measure_vals = self._prepare_measure(line, vals['partner_id'])
                measure = self.env['product.measure'].create(measure_vals)
                line = self.env['sale.order.line'].browse(line['line_id'])
                line.write({'measure_id': measure.id})
                if not sale_order:
                    sale_order = line.order_id
        else:
            sale_vals = self._prepare_order_from_measure(vals)
            sale_order = self.create(sale_vals)
        sale_order.set_partner_measure(vals['measure_user']['data'])
        return True

    def _prepare_partner_measure(self):
        res = {}
        measure = self.partner_id.measure_ids\
            and self.partner_id.measure_ids[0]
        if measure:
            for field_name, field in measure._columns.items():
                if hasattr(field, 'form') and field.form:
                    res[field_name] = measure[field_name]
        return res

    @api.one
    def _prepare_export_measure_from_order(self):
        return {
            'id': self.id,
            'name': self.name,
            'partner_name': self.partner_id.name,
            'partner_matricule': '1234',
            'partner_id': self.partner_id.id,
            'order_line': self.order_line._prepare_order_line_measure(),
            #TODO add real data
            'measure_user': {
                'data': self._prepare_partner_measure(),
            }
        }

    @api.model
    def get_measure(self):
        domain = [
            ['order_line.need_measure', '=', True],
            ]
        return self.search(domain)._prepare_export_measure_from_order()
