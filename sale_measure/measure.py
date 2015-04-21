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
    qty = fields.Float('qantity',help="What needs to be done?")
    
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
        valeur = "','".join(listb)
        return"{'invisible': [('measure_form_type','in',['"+valeur+"'])]}"
    
    def _get_list_article(self):
        list = []
        for key in self.get_form().keys():
            list.append(key) 
        return list
   
    def _all_fields(self):
        list=[]
        for article in self.get_form().keys():
            for field in self.get_form()[article].keys():
                if field not in list:
                    list.append(field)
        return list
            
    def _fields_link_article(self):
        dict = {}
        for field in self._all_fields():
            dict[field] = self._get_list_article()
        return dict
        
    def _prepare_list_for_inivisble(self):
        dict_fields_link_article = self._fields_link_article()
        for article in self._get_list_article():
            list_fields_of_article = []
            for field in self.get_form()[article].keys():
                    list_fields_of_article.append(field)
            for key,value in dict_fields_link_article.items(): 
               if key in list_fields_of_article :
                    if article in value:
                        value.remove(article)
        return dict_fields_link_article
 
    @api.model               
    def fields_view_get(self,view_id=None, view_type='form',
     toolbar=False, submenu=False):
        
        res = super(MeasureMeasure, self).fields_view_get( view_id = view_id,
                        view_type=view_type,toolbar=toolbar, submenu=submenu)
        list_component = self._prepare_list_for_inivisble()
        if view_type == 'form':
            root = etree.fromstring(res['arch'])
            for field in root.findall(".//field"):             
                for key,value in self._prepare_list_for_inivisble().items():
                    if field.attrib['name'] == key:
                        field.set('attrs',self._prepare_attrs_value(value))
                        orm.setup_modifiers(field, root)
            res['arch'] = etree.tostring(root, pretty_print=True)
        return res
            
            
    
    
    
    
    
    




  
    
