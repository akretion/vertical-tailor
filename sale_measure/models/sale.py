# -*- coding: utf-8 -*-
# Copyright (C) 2015-Today Akretion
# @author Abdessamad HILALI <abdessamad.hilali@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

"""
Sale line Class there is a link with measure Class

"""
from odoo import fields, models, api


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

    @api.depends('measure_id', 'product_id.measure_form_type',
                 'order_id.state')
    @api.multi
    def _compute_need_measure(self):
        for record in self:
            if (record.order_id.state != 'cancel' and
                    record.product_id.measure_form_type and not
                    record.measure_id):
                record.need_measure = True
            else:
                record.need_measure = False

    @api.multi
    def _prepare_order_line_measure(self):
        self.ensure_one()
        return {
            'product_name': self.product_id.name,
            'product_id': self.product_id.id,
            'form': self.product_id.measure_form_type,
            'line_id': self.id,
            'qty': self.product_uom_qty,
            }

    @api.model
    def _check_exception_no_measure_for_product(self):
        if self.need_measure:
            return True
        return False


class SaleOrder(models.Model):
    _inherit = 'sale.order'

    measure_partner_name = fields.Char(readonly=True)
    measure_partner_ref = fields.Char(readonly=True)
    measure_offline_id = fields.Char(readonly=True)

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
        return self.env.ref('sale_measure.res_partner_mesure_not_found')

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
            'measure_partner_name': vals['partner_name'],
            'measure_partner_ref': vals['partner_matricule'],
            'measure_offline_id': vals['id'],
            'order_line': [
                (0, 0, self._prepare_order_line_from_measure(line, partner.id))
                for line in vals['order_line']
                ],
            }

    @api.multi
    def set_partner_measure(self, vals):
        partner_measure_obj = self.env['partner.measure']
        for record in self:
            domain = [('partner_id', '=', record.partner_id.id)]
            for field_name, field in partner_measure_obj._columns.items():
                if hasattr(field, 'form') and field.form:
                    domain.append((field_name, '=', vals.get(field_name)))
            if not partner_measure_obj.search(domain):
                vals['partner_id'] = record.partner_id.id
                partner_measure_obj.create(vals)
            return True

    @api.model
    def _set_measure_already_done(self, vals):
        return bool(self.search([
            ('measure_offline_id', '=', vals['id']),
            ('measure_partner_name', '=', vals['partner_name']),
            ('measure_partner_ref', '=', vals['partner_matricule']),
            ]))

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
                    sale_order.write({'exception_ids': [(6, 0, [])]})
        else:
            if self._set_measure_already_done(vals):
                return True
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

    @api.multi
    def _prepare_export_measure_from_order(self):
        for record in self:
            return {
                'id': record.id,
                'name': record.name,
                'partner_name': record.partner_id.name,
                'partner_matricule': record.partner_id.ref,
                'partner_id': record.partner_id.id,
                'order_line': [
                    line._prepare_order_line_measure()
                    for line in record.order_line if line.need_measure],
                #TODO add real data
                'measure_user': {
                    'data': record._prepare_partner_measure(),
                },
                'warehouse_id': record.warehouse_id.id,
            }

    @api.model
    def get_measure(self):
        domain = [
            ['order_line.need_measure', '=', True],
            ]
        return self.search(domain)._prepare_export_measure_from_order()
