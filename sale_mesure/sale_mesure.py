from openerp import fields, models , api
import pdb;

class Measure(models.Model):
    _name = 'measure.measure'
    product_id = fields.Many2one('product.product', string="Product" , required=True)
    partner_id = fields.Many2one('res.partner', string="partner" , required=True)
    
    
    sale_line_ids = fields.One2many('sale.order.line','measure_id', string="Measure Ligne")
    qty = fields.Float('qantity')
    tested_size = fields.Float('Tested Size')
    length_Dos_LON =fields.Float('Length_Dos_Lon')
    sleeve_length_left_MANG = fields.Float('Sleeve length left')
    sleeve_length_right_MAND = fields.Float('Sleeve length right ')
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

    
    
class SaleLineOrder(models.Model):
    _inherit ='sale.order.line'
    _name = 'sale.order.line'
    
   
    measure_id = fields.Many2one('measure.measure', string = "Measure" ,domain="[(('product_id','=',product_id))]")#je suis la
    
   
    