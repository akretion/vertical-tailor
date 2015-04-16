from openerp import fields, models , api
import xml.etree.cElementTree as ET
tree = ET.parse('product.xml')
root = tree.getroot()

class ProductProduct(models.Model):
    _inherit='product.product'
        
    mesure_form_type =fields.Selection(compute ='_get_mesure_form_type')

    def _get_mesure_form_type(self):
	list = []
	for attribute in self.env['mesure.mesure']._get_form() :
            list.append(attribute)
	return list
    
    def _prepare_attrs_value(self,listb):
	s = "','".join(listb)
	return"{'invisible': [('mesure_form_type','in',['"+s+"'])]}"
    
   
    
    def _add_attrus_to_field(self):
	listb=list(self._get_mesure_form_type())
	for attribute in self._get_mesure_form_type() :
	    listb.remove(attribute)
	    for target in root.findall("./data/record/field/xpath/group[@name='{}']".format(attribute)):
		for field in target.findall("./field"):
		    field.set('attrs',_prepare_attrs_value(listb))
	listb.append(attribute)
    tree.write('product.xml')
    




        
        
        