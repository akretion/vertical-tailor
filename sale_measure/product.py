from openerp import fields, models, api


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    measure_form_type = fields.Selection(selection='_get_measure_form_type')

    def _get_measure_form_type(self):
        list = []
        form = self.env['measure.measure'].get_form()
        for key in form.keys():
            list.append((key, key))
        return list

    @api.one
    def _prepare_measurable_product(self):
        return {
            'name': self.name,
            'form': self.measure_form_type,
            'id': self.id,
            }

    @api.model
    def get_measurable_product(self):
        products = self.search([('measure_form_type', '!=', False)])
        return products._prepare_measurable_product()


class ProductProduct(models.Model):
    _inherit = 'product.product'

    measure_form_type = fields.Selection(selection='_get_measure_form_type')

    def _get_measure_form_type(self):
        list = []
        form = self.env['measure.measure'].get_form()
        for key in form.keys():
            list.append((key, key))
        return list
