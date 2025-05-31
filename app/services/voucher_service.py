from app.models import Voucher, Basket

from app import db


def inp(barcode, basket):
    if Voucher.query.filter_by(barcode=barcode).all():
        return {'msg': '此凭证已存在'}
    voucher = Voucher(barcode, basket)
    db.session.add(voucher)
    db.session.flush()
    db.session.commit()
    return {'msg': '凭证录入成功'}


def get(barcode):
    voucher = Voucher.query.filter_by(barcode=barcode).first()
    if not voucher:
        return {'msg': '此凭证未录入'}
    basket = Basket.query.filter_by(id=voucher.basket).first()
    return {
        'msg': '查询成功',
        'basket_barcode': basket.barcode
    }
