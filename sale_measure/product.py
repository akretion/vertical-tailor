from openerp import fields, models , api

class ProductProduct(models.Model):
    _inherit='product.product'
        
    measure_form_type =fields.Selection(selection='_get_measure_form_type')

    def _get_measure_form_type(self):
	list = []
	form = self.env['measure.measure'].get_form()
	#import pdb; pdb.set_trace()
	for key in form.keys():
            list.append((key,key))
	    
	return list
    

    




        
        
        