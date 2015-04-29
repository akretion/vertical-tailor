# -*- coding: utf-8 -*-
##############################################################################
#
#  licence AGPL version 3 or later
#  see license in __openerp__.py or http://www.gnu.org/licenses/agpl-3.0.txt
#  Copyright (C) 2015 Akretion (http://www.akretion.com).
#  @author Abdessamad HILALI <abdessamad.hilali@akretion.com>
#
##############################################################################

from openerp import fields, models


class MeasureDemo(models.Model):
    """ Measure Class demo """
    _inherit = "measure.measure"

    tested_size = fields.Float(" Tested size")
    length_Dos_LON = fields.Selection(
        [('EN+', 'EN+'),
         ('EN-', 'EN-')],
        'Length Dos Lon')
    sleeve_length_left_MANG = fields.Selection(
        [('EN+', 'EN+'),
         ('EN-', 'EN-')],
        'Sleeve length left')
    sleeve_length_right_MAND = fields.Selection(
        [('EN+', 'EN+'),
         ('EN-', 'EN-')],
        'Sleeve length right')
    vor_attitude_VOR = fields.Float('Vor attitude')
    shoulders_CAR = fields.Float('Shoulders')
    belt_CEI = fields.Float('Belt')
    basin_LBA = fields.Float('Basin')
    shoulder_width_LEP = fields.Float('Shoulder width')
    armhole_Edge_CAM = fields.Float('Armhole Edge')
    sleeves_MAR = fields.Float('Sleeves')
    shoulder_height_left_HEPL = fields.Float('shoulder height left')
    shoulder_eight_right_HEPR = fields.Float('shoulder height right')
    progress_before_AVD = fields.Float('Progress Before')
    shoulder_behind_EPAB = fields.Float('Shoulder Behind')
    shoulder_forward_EPAF = fields.Float('Shoulder forward')
    hollow_kidneys_CBR = fields.Float('Hollow Kidneys')
    forcing_chest_clip_FPP = fields.Float('Forcing Chest Clip')
    forcing_chest_obesity_FPV = fields.Float('Force Chest Obesity')
    short_neck_back_amount_TDD = fields.Float('Short Neck Back Amount')
    strong_chest_DED = fields.Float('Strong Chest')
    clip_in_reverse_PSR = fields.Boolean('Clip In Reverse')
    length_dimension_PLO = fields.Selection(
        [('EN+', 'EN+'),
         ('EN-', 'EN-')],
        'length dimension PLO')
    half_width_belt_PCE = fields.Float('half width belt PCE')
    parallel_amount_PCO = fields.Float('parallel amount PCO ')
    amount_before_PDE = fields.Float('amount before PDE')

    @classmethod
    def get_form(cls):
        """ return a dictionary with form and attribute value"""
        return {
            'vareuse_homme_lot1':
                {
                    'qty': {
                        'name': 'Quantite',
                        'type': 'integer'
                        },
                    'tested_size': {
                        'name': 'Taille essayee',
                        'type': 'integer'
                        },
                    'vor_attitude_VOR': {
                        'name': 'Attitude VOR',
                        'value': [-3, -2, -1, 1, 2, 3],
                        'type': 'integer'
                        },
                    'short_neck_back_amount_TDD': {
                        'name': 'Montant dos cou court-cou long TDD',
                        'value': [-1.5, -1, -0.5, 0.5, 1, 1.5],
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
                        'value': [-1.5, -1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                    'shoulder_behind_EPAB': {
                        'name': 'Epaule Arriere EPA',
                        'value': [-1.5, -1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                    'shoulder_forward_EPAF': {
                        'name': 'Epaule Avant EPA',
                        'value': [-1.5, 1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                    'strong_chest_DED': {
                        'name': 'Poitrine forte (dvpmt devant) DED',
                        'value': [1, 1.5, 2],
                        'type': 'interger'
                        },
                    'forcing_chest_clip_FPP': {
                        'name': 'Forcer pince poitrine FPP',
                        'value': [0.5, 1, 2],
                        'type': 'interger'
                        },
                    'shoulders_CAR': {
                        'name': '1/2 Carrure CAR',
                        'value': [-1.5, 1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                    'shoulder_width_LEP': {
                        'name': 'Largeur epaule LEP',
                        'value': [-1.5, 1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                    'armhole_Edge_CAM': {
                        'name': 'Carre d''emmanchure CAM',
                        'value': [-1.5, 1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                    'belt_CEI': {
                        'name': '1/2 Ceinture CEI',
                        'value': [-1.5, 1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                    'basin_LBA': {
                        'name': '1/2 Bassin LBA',
                        'value': [-1.5, 1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                    'clip_in_reverse_PSR': {
                        'name': 'Pince sous revers PSR',
                        'type': 'Boolean'
                        },
                    'forcing_chest_obesity_FPV': {
                        'name': 'Forcer pince obesite FPV',
                        'value': [1, 1.5, 2],
                        'type': 'interger'
                        },
                    'hollow_kidneys_CBR': {
                        'name': 'Reins Creux CBR',
                        'value': [1, 1.5, 2],
                        'type': 'integer'
                        },
                    'length_Dos_LON': {
                        'name': 'Longueur Dos LAN',
                        'value': ['EN-', 'EN+'],
                        'type': 'Selection'
                        },
                    'sleeve_length_left_MANG': {
                        'name': 'Longueur manche Gauche',
                        'value': ['EN-', 'EN+'],
                        'type': 'Selection'
                        },
                    'sleeve_length_right_MAND': {
                        'name': 'Longueur manche Droite',
                        'value': ['EN-', 'EN+'],
                        'type': 'Selection'
                        },
                    'sleeves_MAR': {
                        'name': ' manches MAR ',
                        'value': [-1.5, 1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'},
                    },
            'jupe_lot2':
                {
                    'qty': {
                        'name': 'Quantite',
                        'type': 'integer'
                        },
                    'tested_size': {
                        'name': 'Taille essayee',
                        'type': 'integer'
                        },
                    'length_dimension_PLO': {
                        'name': 'Longueur Cote',
                        'value': ['EN-', 'EN+'],
                        'type': 'Selection'
                        },
                    'half_width_belt_PCE': {
                        'name': 'Largeur 1/2 ceinture PCE',
                        'value': [-2, -1.5, -1, 1, 1.5, 2],
                        'type': 'integer'
                        },
                    'parallel_amount_PCO': {
                        'name': 'Montant parallele PCO',
                        'value': [-3, -2, -1, 1, 2, 3],
                        'type': 'integer'
                        },
                    'basin_LBA': {
                        'name': '1/2 Bassin LBA',
                        'value': [-1.5, -1, -0.5, 0.5, 1, 1.5],
                        'type': 'interger'
                        },
                    'amount_before_PDE': {
                        'name': 'Montant devant PDE',
                        'value': [-3, -2, -1, 1, 2, 3],
                        'type': 'interger'
                        },
                    },
        }


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
