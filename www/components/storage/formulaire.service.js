angular.module('starter')
.factory('Formulaire', ['localStorage', '$q', function(localStorage, $q) {

var defaultForms = {
	'vareuse': [
		{ categorie: '', questions: [
			{ label: 'tissu', type: 'array', valeurs: ['CPL 295 TDF','CPL 295 bleu foncé','CPL 300 bleu aviation','CPL 340 bleu marine','SPV 260 blanc'] },
			{ label: 'quantité', type:'numeric'},
			{ label: 'taille essayée', type:'numeric'},
			{ label: 'attitude vor', type:'array', valeurs: ['-3','-2','-1','1','2','3']}
		]},
		{ categorie: 'hauteur épaule HEP', questions: [
			{label: 'hepg', type: 'array', valeurs: ['-1.5','-1','1','1.5','2']},
			{label: 'hepd', type: 'array', valeurs: ['-1.5','-1','1','1.5','2']},
			{label: 'avance devant', type: 'array', valeurs: ['-1.5','-1','-0.5','0.5','1','1.5']}
		]},
		{ categorie: 'epaule EPA', questions: [
			{ label:'voutée en +', type:'numeric'},
			{ label:'renversée en -', type:'numeric'},
			{ label: '??', type: 'array', valeurs: ['-1.5','-1','-0.5','0.5','1','1.5']}
		]},
		{categorie: '', questions: [
			{ label:'poitrine forte', type: 'array', valeurs: ['1','1.5','2']},
			{ label:'forcer pince poitrine', type: 'array', valeurs: ['0.5','1','1.5']},
			{ label:'1/2 carrure', type: 'array', valeurs: ['-1.5','-1','-0.5','0.5','1','1.5']},
			{ label:'largeur épaule', type: 'array', valeurs: ['-1.5','-1','-0.5','0.5','1','1.5']},
			{ label:'carré d\'emmanchure', type: 'array', valeurs: ['-1.5','-1','-0.5','0.5','1','1.5']},
			{ label:'1/2 ceinture', type: 'array', valeurs: ['-1.5','-1','-0.5','0.5','1','1.5']},
			{ label:'1/2 bassin', type: 'array', valeurs: ['-1.5','-1','-0.5','0.5','1','1.5']},
			{ label:'pince sous revers', type: 'array', valeurs: ['oui','non']},
			{ label:'forcer pince obésité', type: 'array', valeurs: ['1','1.5','2']},
			{ label:'reins creux', type: 'array', valeurs: ['1','1.5','2']},
			{ label:'longeur dos en + ou en -', type:'numeric'}
		]},
		{ categorie: 'longueur manches', questions: [
			{ label:'mang (en + ou en -', type:'numeric'},
			{ label:'mand (en + ou en -', type:'numeric'}
		]}
	],
	'PentalonF': [
		{categorie: '', questions: [
			{ label:'Hauteur', type: 'array', valeurs: ['36','37','38','39', '40']},
			{ label:'Largeur', type: 'array', valeurs: ['0.5','1','1.5']},
		]}		
	]
};
	return {
		get: function (formName) {
			return localStorage.get('form.'+formName).then(null, function () {
				var localForm;
				localForm = defaultForms[formName];
				if (!localForm) {
					return $q.reject('Form not found ');
				}
				localStorage.set('form.'+formName, localForm);
				return localForm;
			});
		}
	}
}
]);
