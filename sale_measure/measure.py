from openerp import fields, models , api
from openerp import exceptions


class Measure(models.Model):
    _name = 'measure.measure'
    product_id = fields.Many2one('product.product', string="Product" , required=True)
    partner_id = fields.Many2one('res.partner', string="partner" , required=True)
    mesure_form_type = fields.Char(related='product_id.mesure_form_type', store=True)
    sale_line_ids = fields.One2many('sale.order.line','measure_id', string="Measure Ligne")
    qty = fields.Float('qantity',help="What needs to be done?")
   
    
    @api.model
    def get_form(self):
     return {}
    
    def _check_form(self):
        for attribute  in self._get_form()[self.mesure_form_type]:
            if not (attribute [value] in self.attribute ):
               raise exceptions.Warning('there are a problem with your numbers exactly in %c .' %attribute[name])

class SaleLineOrder(models.Model):
    _inherit ='sale.order.line'
    _name = 'sale.order.line'
    measure_id = fields.Many2one('measure.measure', string = "Measure" ,domain="[(('product_id','=',product_id))]")#je suis la
    
   
    