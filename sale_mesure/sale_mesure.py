from openerp import fields, models , api
from openerp import exceptions
import pdb;
import xml.etree.cElementTree as ET
from xml.etree.ElementTree import Element
tree = ET.parse('XML.xml')
root = tree.getroot()

class Measure(models.Model):
    _name = 'measure.measure'
    product_id = fields.Many2one('product.product', string="Product" , required=True)
    partner_id = fields.Many2one('res.partner', string="partner" , required=True)
    mesure_form_type = fields.Char(related='product_id.mesure_form_type', store=True)
    
   

    
   #veresue homme_lot1
    sale_line_ids = fields.One2many('sale.order.line','measure_id', string="Measure Ligne")
    qty = fields.Float('qantity',help="What needs to be done?")
    tested_size = fields.Float('Tested Size')
    length_Dos_LON = fields.Selection( [('en+','EN+'), ('en-','EN-')],'Length Dos Lon')
    sleeve_length_left_MANG = fields.Selection( [('en+','EN+'), ('en-','EN-')],'Sleeve length left')
    sleeve_length_right_MAND = fields.Selection( [('en+','EN+'), ('en-','EN-')],'Sleeve length right')
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
    
    #vereuse homme_lot2
    bottom_unfinished = fields.Boolean('bottom unfinished')
    length_between_legs_PLO = fields.Selection([('en+','EN+'), ('en-','EN-')],'length between legs PLO')
    half_width_belt_PCE = fields.Float('half width belt PCE')
    parallel_amount_PCO = fields.Float('parallel amount PCO ')
    amount_before_PDE = fields.Float ('amount before PDE')
    back_up_PDO = fields.Float('back up PDO')
    advanced_crotch_PLP= fields.Float('advanced crotch PLP')
    width_thighs_PLC = fields.Float('width thighs PLC')
    width_low_PBA = fields.Float('width low PBA')
    
    ##vereuse femme_lot1
    flat_chest_clip_PPP = fields.Float('flat chest clip PPP')
    chest_height = fields.Float('hauteur poitrine')
    curved_center_back_CMD = fields.Float('curved center back CMD')
    
    #manteau
    parity_APL = fields.Float('parity')
    
    # jupe_lot2
    length_dimension_PLO = fields.Selection('length dimension PLO')
    
    @api.model
    def _get_form(self):
     return {}
    
    @api.depends(
        'qty','tested_size','length_Dos_LON','sleeve_length_left_MANG','vor_attitude_VOR','shoulders_CAR','belt_CEI'
        ,'basin_LBA','shoulder_width_LEP','shoulder_behind_EPAB',' shoulder_forward_EPAF','hollow_kidneys_CBR ','forcing_chest_clip_FPP'
        ,'forcing_chest_obesity_FPV','short_neck_back_amount_TDD','strong_chest_DED','clip_in_reverse_PSR','bottom_unfinished','length_between_legs_PLO'
        ,'half_width_belt_PCE','parallel_amount_PCO','amount_before_PDE','back_up_PDO','advanced_crotch_PLP','width_thighs_PLC','width_low_PBA'
        'flat_chest_clip_PPP','chest_height','curved_center_back_CMD','parity_APL','length_dimension_PLO')
    def _check_form(self):
        for attribute  in self._get_form()[self.mesure_form_type]:
            if not (attribute [value] in self.attribute ):
               raise exceptions.Warning('there are a problem with your numbers exactly in %c .' %attribute[name])
            

                
        
    
    
    
    
    
    
    
    
    
    
    

    
    

    
    
class SaleLineOrder(models.Model):
    _inherit ='sale.order.line'
    _name = 'sale.order.line'
    
   
    measure_id = fields.Many2one('measure.measure', string = "Measure" ,domain="[(('product_id','=',product_id))]")#je suis la
    
   
    