import setuptools

with open('VERSION.txt', 'r') as f:
    version = f.read().strip()

setuptools.setup(
    name="odoo10-addons-akretion-vertical-tailor",
    description="Meta package for akretion-vertical-tailor Odoo addons",
    version=version,
    install_requires=[
        'odoo10-addon-sale_measure',
    ],
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Odoo',
        'Framework :: Odoo :: 10.0',
    ]
)
