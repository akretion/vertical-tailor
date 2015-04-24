from openerp import fields, models , api
from collections import defaultdict
from openerp.exceptions import Warning
from openerp.osv import orm
from lxml import etree


class MeasureMeasure(models.Model):
    _name = 'measure.measure'
    _description = "Measure for each partner"

    product_id = fields.Many2one(
            'product.product',
            string="Product" ,
            required=True)
    partner_id = fields.Many2one(
        'res.partner',
        string="partner",
        required=True)
    measure_form_type = fields.Selection(
        related='product_id.measure_form_type',
        readonly=True)
    sale_line_ids = fields.One2many(
        'sale.order.line',
        'measure_id',
        string="Measure Ligne")
    qty = fields.Float('Quantity')

    @classmethod
    def get_form(cls):
        return {}

    def _check_form(self):
        message = ('There are a problem'
                'in %s the value isn`t in %s'
                %(value['name'], value['value'])
                 )
        for key,value  in self.get_form()[self.measure_form_type].items():
            if 'value' in value.keys():
                if self[key] not in value['value']:
                    raise Warning(message)
    @api.multi
    def write(self, vals):
        res = super(MeasureMeasure, self).write(vals)
        self._check_form()
        return res

    @api.model
    def create(self,vals):
        res = super(MeasureMeasure,self).create(vals)
        res._check_form()
        return res
    
    def _prepare_attrs_value(self,list_invisible_form):
          return {
                  'invisible': [('measure_form_type','not in',list_invisible_form)]
              }
        
    def _prepare_list_for_invisible(self):
        dict_fields_link_form = defaultdict(list)
        for form,value in self.get_form().items():
            for field in value:
                    dict_fields_link_form[field].append(form)
        return dict_fields_link_form

    @api.model
    def fields_view_get(self, view_id=None, view_type='form',
                        toolbar=False, submenu=False):
        res = super(MeasureMeasure, self).fields_view_get(
            view_id=view_id,
            view_type=view_type,
            toolbar=toolbar,
            submenu=submenu)
        if view_type == 'form':
            root = etree.fromstring(res['arch'])
            get_list_invisible_form = self._prepare_list_for_invisible()
            for field in root.findall(".//field"):
                if get_list_invisible_form[field.attrib['name']]:
                    attrs = get_list_invisible_form[field.attrib['name']]
                    field.set('attrs',str(self._prepare_attrs_value(attrs)))
                    orm.setup_modifiers(root, field)
            res['arch'] = etree.tostring(root, pretty_print=True)
        return res
