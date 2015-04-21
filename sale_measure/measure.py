from openerp import fields, models , api
from openerp import exceptions
from openerp.osv import orm
from lxml import etree
   
    
class MeasureMeasure(models.Model):
    _name = 'measure.measure'
    _description =" Measure for each partner "

    product_id = fields.Many2one('product.product',
                                            string="Product" , required=True)
    partner_id = fields.Many2one('res.partner',
                                            string="partner" , required=True)
    measure_form_type = fields.Selection(
                        related='product_id.measure_form_type' ,readonly=True)
    sale_line_ids = fields.One2many('sale.order.line','measure_id',
                                    string="Measure Ligne")
    qty = fields.Float('qantity')
    
    @classmethod
    def get_form(cls):
        return {}
    
    def _check_form(self):
        ky = self.get_form()[self.measure_form_type].keys()
        values = self.get_form()[self.measure_form_type].values()
        for key,value  in zip(self.get_form()[self.measure_form_type].keys(),
                        self.get_form()[self.measure_form_type].values()):
            if 'value' in value.keys():
                if self[key] not in value['value']:
                    raise exceptions.Warning('there are a problem '
                    'in {} the value isn`t in {}'
                    .format(value['name'],value['value']))
    @api.multi
    def write(self,vals):
        res = super(MeasureMeasure,self).write(vals)
        self._check_form()
        return res
    
    @api.model
    def create(self,vals):
        res = super(MeasureMeasure,self).create(vals)
        res._check_form()
        return res
    
    def _prepare_attrs_value(self,listb):
          return {
                  'invisible': [('measure_form_type','not in',listb)]
              }
    
    def _get_list_article(self):
        list = []
        for keys in self.get_form().keys():
            list.append(key) 
        return list
   
    def _all_fields(self):
        list=[]
        for form, values in self.get_form().items():
            for field in values:
                if field not in list:
                    list.append(field)
        return list
            
    def _fields_link_article(self):
        dict = {}
        for field in self._all_fields():
            dict[field] = self._get_list_article()
        return dict

    def _prepare_list_for_invisible(self):
        dict_fields_link_form={}
        for field in self._all_fields():
            list_invisible_element =[]
            for keys,value in self.get_form().items():
                if field in value.keys() :
                    if keys not in list_invisible_element:
                        list_invisible_element.append(keys)   
            dict_fields_link_form[field]=list_invisible_element
        return dict_fields_link_form
 
    @api.model               
    def fields_view_get(self,view_id=None, view_type='form',
     toolbar=False, submenu=False):
        
        res = super(MeasureMeasure, self).fields_view_get( view_id = view_id,
                        view_type=view_type,toolbar=toolbar, submenu=submenu)
        if view_type == 'form':
            root = etree.fromstring(res['arch'])
            for field in root.findall(".//field"):
                if field.attrib['name'] in self._prepare_list_for_invisible().keys():
                    attrs = self._prepare_list_for_invisible()[field.attrib['name']]
                    field.set('attrs',str(self._prepare_attrs_value(attrs)))
                    orm.setup_modifiers(field, root)
            res['arch'] = etree.tostring(root, pretty_print=True)
        return res
 
    
    




  
    
