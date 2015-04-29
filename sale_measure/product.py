"""imports checkers for Python code"""

from openerp import fields, models


class ProductProduct(models.Model):
    """ Product Class """
    _inherit = 'product.product'

    measure_form_type = fields.Selection(selection='_get_measure_form_type')

    def _get_measure_form_type(self):
        """ Get a form dictionary  """
        form_list = []
        form = self.env['measure.measure'].get_form()
        for key in form.keys():
            form_list.append((key, key))
        return form_list
