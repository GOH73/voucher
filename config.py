import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'mysql://root:mysqL2022@localhost/voucher_db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
