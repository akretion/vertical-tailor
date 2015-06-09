from openerp import fields, models


class Partner(models.Model):
    _inherit = "res.partner"

    measure_ids = fields.One2many('partner.measure', 'partner_id')
    product_measure_ids = fields.One2many('product.measure', 'partner_id')


class PartnerMeasure(models.Model):
    _name = "partner.measure"
    _order = "date desc"

    partner_id = fields.Many2one(
        'res.partner',
        string="partner",
        required=True)
    date = fields.Date("Date")
    stature = fields.Float("Stature", form=True)
    weight = fields.Float("Weight", form=True)
    chest_size = fields.Float("Chest size", form=True)
    waistline = fields.Float("Waistline", form=True)
    head_size = fields.Float("Head Size", form=True)
    leg_length = fields.Float("Leg length", form=True)
    crotch = fields.Float("Crotch", form=True)
    pelvis_size = fields.Float("Pelvis Size", form=True)

    @classmethod
    def _get_form(cls):
        res = {
            'group_title': '',
            'questions' : [],
            }
        for field_name, field in cls._columns.items():
            if hasattr(field, 'form') and field.form:
                res['questions'].append({
                    'name': field_name,
                    'widget': 'numeric',
                    'label': field.string,
                    })
        return [res]
