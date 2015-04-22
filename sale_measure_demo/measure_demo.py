# -*- coding: utf-8 -*-
##############################################################################
#
#    Copyright (C) All Rights Reserved 2015 Akretion
#    @author Abdessamad HILALI <abdessamad.hilali@akretion.com>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
###############################################################################

from openerp import fields, models , api
from collections import defaultdict
from openerp import exceptions
from openerp.osv import orm
from lxml import etree

class MeasureDemo(models.Model):
    _name="measure.measure.demo"

    product_id = fields.Many2one('product.product',
                                            string="Product" , required=True)
    partner_id = fields.Many2one('res.partner',
                                            string="partner" , required=True)
    measure_form_type = fields.Selection(
                        related='product_id.measure_form_type' ,readonly=True)
    sale_line_ids = fields.One2many('sale.order.line','measure_id',
                                    string="Measure Ligne")
    qty = fields.Float('qantity')
    tested_size = fields.Float(" Tested size") 
    length_Dos_LON = fields.Selection( [('EN+','EN+'),
                                ('EN-','EN-')],'Length Dos Lon')
    sleeve_length_left_MANG = fields.Selection( [('EN+','EN+'),
            ('EN-','EN-')],'Sleeve length left')
    sleeve_length_right_MAND = fields.Selection( [('EN+','EN+'),
                    ('EN-','EN-')],'Sleeve length right')
    vor_attitude_VOR = fields.Float('Vor attitude')
    shoulders_CAR = fields.Float('Shoulders')
    belt_CEI = fields.Float('Belt')
    basin_LBA = fields.Float('Basin')
    shoulder_width_LEP = fields.Float('Shoulder width')
    armhole_Edge_CAM = fields.Float('Armhole Edge')
    sleeves_MAR = fields.Float ('Sleeves')
    shoulder_height_left_HEPL = fields.Float('shoulder height left')
    shoulder_eight_right_HEPR = fields.Float('shoulder height right')
    progress_before_AVD = fields.Float('Progress Before')
    shoulder_behind_EPAB = fields.Float('Shoulder Behind')
    shoulder_forward_EPAF = fields.Float('Shoulder forward')
    hollow_kidneys_CBR = fields.Float('Hollow Kidneys')
    forcing_chest_clip_FPP = fields.Float('Forcing Chest Clip')
    forcing_chest_obesity_FPV =  fields.Float('Force Chest Obesity')
    short_neck_back_amount_TDD = fields.Float('Short Neck Back Amount')
    strong_chest_DED = fields.Float('Strong Chest')
    clip_in_reverse_PSR = fields.Boolean('Clip In Reverse')
    length_dimension_PLO =fields.Selection( [('EN+','EN+'), ('EN-','EN-')],
                                            'length dimension PLO')

    half_width_belt_PCE = fields.Float('half width belt PCE')
    parallel_amount_PCO = fields.Float('parallel amount PCO ')
    amount_before_PDE = fields.Float ('amount before PDE')
           
      
    
                
    def get_form(cls):
        return {
                
                'vareuse_homme_lot1':
                {    
                        'qty': {
                        'name':'Quantite',
                        #'value': [],
                        'type': 'integer'
                                 },
                        'tested_size': {
                        'name':'Taille essayee',
                        #'value':[],
                        'type':'integer'
                        },
                        'vor_attitude_VOR': {
                        'name': 'Attitude VOR',
                        'value':[-3, -2, -1, 1, 2, 3],
                        'type': 'integer'
                        },
                        'short_neck_back_amount_TDD': {
                        'name': 'Montant dos cou court-cou long TDD',
                        'value': [-1.5, -1, -0.5, 0.5 ,1 ,1.5],
                        'type': 'interger'
                        },
                        'shoulder_height_left_HEPL': {
                        'name': 'Hauteur epaule Gauche HEPG',
                        'value': [-2, -1, 1, 2],
                        'type': 'interger'
                        },
                        'shoulder_eight_right_HEPR': {
                        'name': 'Hauteur epaule Droite HEPD',
                        'value': [-2, -1, 1, 2],
                        'type': 'interger'
                        },
                        'progress_before_AVD': {
                        'name': 'Avancement devant AVD',
                        'value':[-1.5, -1, -0.5 , 0.5 ,1 ,1.5],
                        'type': 'interger'
                        },
                        'shoulder_behind_EPAB': {
                        'name': 'Epaule Arriere EPA',
                        'value':[-1.5, -1, -0.5,  0.5, 1, 1.5],
                        'type': 'interger'
                        },
                        'shoulder_forward_EPAF': {
                        'name': 'Epaule Avant EPA',
                        'value':[-1.5, 1,-0.5,  0.5, 1, 1.5],
                        'type': 'interger'
                        },
                        'strong_chest_DED': {
                        'name': 'Poitrine forte (dvpmt devant) DED',
                        'value':[1, 1.5, 2],
                        'type': 'interger'
                        },
                        'forcing_chest_clip_FPP': {
                        'name': 'Forcer pince poitrine FPP',
                        'value':[0.5, 1, 2],
                        'type': 'interger'
                        },
                        'shoulders_CAR': {
                        'name': '1/2 Carrure CAR',
                        'value':[-1.5, 1,-0.5,  0.5, 1, 1.5],
                        'type': 'interger'
                        },
                        'shoulder_width_LEP': {
                        'name': 'Largeur epaule LEP',
                        'value':[-1.5, 1,-0.5,  0.5, 1, 1.5],
                        'type': 'interger'
                        },
                        'armhole_Edge_CAM': {
                        'name': 'Carre d''emmanchure CAM',
                        'value':[-1.5, 1,-0.5,  0.5, 1, 1.5],
                        'type': 'interger'
                        }, 
                        'belt_CEI': {
                        'name': '1/2 Ceinture CEI',
                        'value':[-1.5, 1,-0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                        'basin_LBA': {
                        'name': '1/2 Bassin LBA',
                        'value':[-1.5, 1,-0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                        'clip_in_reverse_PSR': {
                        'name': 'Pince sous revers PSR',
                        'type': 'Boolean'
                        },
                        'forcing_chest_obesity_FPV': {
                        'name': 'Forcer pince obesite FPV',
                        'value':[1, 1.5, 2],
                        'type': 'interger'
                        },
                        'hollow_kidneys_CBR': {
                        'name': 'Reins Creux CBR',
                        'value':[1, 1.5, 2] ,
                        'type': 'integer'
                        },
                        'length_Dos_LON': {
                        'name': 'Longueur Dos LAN',
                        'value':['EN-','EN+'],
                        'type': 'Selection'
                        },
                        'sleeve_length_left_MANG': {
                        'name': 'Longueur manche Gauche',
                        'value':['EN-','EN+'],
                        'type': 'Selection'
                        },
                        'sleeve_length_right_MAND': {
                        'name': 'Longueur manche Droite',
                        'value':['EN-','EN+'],
                        'type': 'Selection'
                        },
                         'sleeves_MAR': {
                        'name': ' manches MAR ',
                        'value':[-1.5, 1,-0.5, 0.5, 1, 1.5],
                        'type': 'interger'},
                },
     
     'jupe_lot2':
                {
                        'qty': {
                        'name': 'Quantite',
                        #'value': [],
                        'type': 'integer'
                        },
                        'tested_size': {
                        'name': 'Taille essayee',
                        #'value': [],
                        'type': 'integer'
                        },
                        'length_dimension_PLO' : {
                        'name': 'Longueur Cote',
                        'value':['EN-','EN+'],
                        'type': 'Selection'
                        },
                        'half_width_belt_PCE':{
                        'name': 'Largeur 1/2 ceinture PCE',
                        'value':[-2, -1.5,-1, 1, 1.5, 2],
                        'type': 'integer'
                        },
                        'parallel_amount_PCO':{
                        'name': 'Montant parallele PCO',
                        'value':[-3,-2, -1, 1, 2, 3],
                        'type': 'integer'
                        },
                        'basin_LBA': {
                        'name': '1/2 Bassin LBA',
                        'value':[-1.5, -1,-0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                        'amount_before_PDE': {
                        'name': 'Montant devant PDE',
                        'value':[-3,-2, -1, 1, 2, 3],
                        'type': 'interger'
                        },   
                },
        }
    
    def _check_form(self):
        ky = self.get_form()[self.measure_form_type].keys()
        values = self.get_form()[self.measure_form_type].values()
        for key,value  in zip(self.get_form()[self.measure_form_type].keys(),
                        self.get_form()[self.measure_form_type].values()):
            if 'value' in value.keys():
                if self[key] not in value['value']:
                    raise exceptions.Warning('There are a problem '
                    'in {} the value isn`t in {}'
                    .format(value['name'],value['value']))
    @api.multi
    def write(self,vals):
        res = super(MeasureDemo,self).write(vals)
        self._check_form()
        return res
    
    @api.model
    def create(self,vals):
        res = super(MeasureDemo,self).create(vals)
        res._check_form()
        return res
    
    def _prepare_attrs_value(self,listb):
          return {
                  'invisible': [('measure_form_type','not in',listb)]
              }
        
    def _prepare_list_for_invisible(self):
        dict_fields_link_form = defaultdict(list)
        for form,value in self.get_form().items():
            for field in value:
                    dict_fields_link_form[field].append(form)
        return dict_fields_link_form
     
    @api.model               
    def fields_view_get(self,view_id=None, view_type='form',
     toolbar=False, submenu=False):
        
        res = super(MeasureDemo, self).fields_view_get( view_id = view_id,
                        view_type=view_type,toolbar=toolbar, submenu=submenu)
        if view_type == 'form':
            root = etree.fromstring(res['arch'])
            prepare_list = self._prepare_list_for_invisible()
            for field in root.findall(".//field"):
                if prepare_list[field.attrib['name']]:
                    attrs = prepare_list[field.attrib['name']]
                    field.set('attrs',str(self._prepare_attrs_value(attrs)))
                    orm.setup_modifiers(field, root)
            res['arch'] = etree.tostring(root, pretty_print=True)
        return res
    
    
    
class ProductProduct(models.Model):
    _inherit='product.product'
        
    measure_form_type =fields.Selection(selection='_get_measure_form_type')

    def _get_measure_form_type(self):
	list = []
	form = self.env['measure.measure.demo'].get_form()
	for key in form.keys():
            list.append((key,key))
	    
	return list
    