# -*- coding: utf-8 -*-
""" The goal of this program is make a measure with different
    forms for example trousers,skirt,.... and for each form there are
    differnt fields, so we hide or show fields as a function of forms  """

from openerp import fields, models, api, _
from collections import defaultdict
from openerp.exceptions import Warning
from openerp.osv import orm
from lxml import etree


class ProductMeasure(models.Model):
    """Measure Class"""
    _name = 'product.measure'
    _description = "Measure for each partner"

    product_id = fields.Many2one(
        'product.product',
        string="Product",
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

    @classmethod
    def _get_form(cls):
        return {}

    @api.model
    def get_form(self):
        """ inherited function so we have a same function in custom
             this function return dictionary with all forms attribute """
        res = self._get_form()
        for form in res:
            res[form][0]['questions'].insert(0, {
                'name': 'qty',
                'widget': 'numeric',
                'label': _(self.env['sale.order.line'].\
                    _columns['product_uom_qty'].string),
                    })
        res['common'] = self.env['partner.measure'].browse([])._get_form()
        return res

    def _check_form(self):
        """function used for checking input value """
        for list_dict_question in self.get_form()[self.measure_form_type]:
            for question in list_dict_question['questions']:
                if 'value' in question.keys():
                    val = self[question['name']]
                    if val and val not in question['value']:
                        raise Warning(
                            _("There are problems in %s the value"
                              " is not in %s")
                            % (self._fields[question['name']].string,
                               question['value']))

    @api.multi
    def write(self, vals):
        """ Overload write function """
        res = super(ProductMeasure, self).write(vals)
        self._check_form()
        return res

    @api.model
    def create(self, vals):
        """ Overload Create function """
        res = super(ProductMeasure, self).create(vals)
        res._check_form()
        return res

    def _prepare_attrs_value(self, list_invisible_form):
        """  prepare list of invisible form """
        return {
            'invisible': [('measure_form_type',
                           'not in',
                           list_invisible_form)]
            }

    def _prepare_list_for_invisible(self):
        """  get a list of invisible form """
        dict_fields_link_form = defaultdict(list)
        for form, value in self.get_form().items():
            for dict_question in value:
                for question in dict_question['questions']:
                    dict_fields_link_form[question['name']].append(form)
        return dict_fields_link_form

    @api.model
    def fields_view_get(self,
                        view_id=None,
                        view_type='form',
                        toolbar=False, submenu=False):
        """ Dynamic modification of fields """
        res = super(ProductMeasure, self).fields_view_get(
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
                    field.set('attrs', str(self._prepare_attrs_value(attrs)))
                    orm.setup_modifiers(field, root)
                if 'hide_partner' in self.env.context and field.attrib[
                        'name'] == 'partner_id':
                    field.set('invisible', '1')
                    orm.setup_modifiers(field, root)
            res['arch'] = etree.tostring(root, pretty_print=True)
        return res
