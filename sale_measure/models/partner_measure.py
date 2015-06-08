from openerp import fields, models


class PartnerMeasure(models.Model):
    _name = "partner.measure"

    partner_id = fields.Many2one(
        'res.partner',
        string="partner",
        required=True)
    date = fields.Date("Date")
    stature = fields.Float("Stature")
    weight = fields.Float("Weight")
    chest_size = fields.Float("Chest size")
    waistline = fields.Float("Waistline")
    head_measurement = fields.Float("Head Measurement")
    Leg_length = fields.Float("Leg length")
    crotch = fields.Float("Crotch")
    pelvis_tower = fields.Flaot("Tower Pelvis")
