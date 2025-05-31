from sqlalchemy import desc

from app.models import Basket, User, Voucher, Log
from app import db


def inp(barcode, node, user):
    if Basket.query.filter_by(barcode=barcode).all():
        return {'msg': '此流转包已存在'}

    basket = Basket(barcode, node, user)
    db.session.add(basket)
    db.session.flush()
    db.session.commit()

    log = Log(basket.id, '起点', node, -1, user, comment='装包')
    db.session.add(log)
    db.session.flush()
    db.session.commit()

    return {'msg': '成功添加流转包'}


def insert(user, barcode, vouchers: list):
    operator = User.query.filter_by(id=user).first()
    basket = Basket.query.filter_by(barcode=barcode).first()
    if not basket:
        print(barcode)
        return {'msg': '该流转包不存在'}
    if operator.id != basket.user:
        return {'msg': '权限不足'}

    comment = ''
    for voucher in vouchers:
        v = Voucher(voucher, basket.id)
        db.session.add(v)
        comment += voucher + ' '

    db.session.flush()
    db.session.commit()

    log = Log(basket.id, basket.node, basket.node, user, user, comment=f'添加凭证：{comment}')

    db.session.add(log)
    db.session.flush()
    db.session.commit()

    return {'msg': '凭证插入成功'}


def get(barcode='', user_id=''):
    if barcode:
        basket = Basket.query.filter_by(barcode=barcode).first()
        user = User.query.filter_by(id=basket.user).first()
        vouchers = Voucher.query.filter_by(basket=basket.id).all()
        logs = Log.query.filter_by(basket=basket.id).order_by(desc(Log.time)).all()
        senders = [User.query.filter_by(id=log.sender).first() for log in logs]
        receivers = [User.query.filter_by(id=log.receiver).first() for log in logs]

        return {
            'barcode': basket.barcode,
            'user_name': user.name,
            'user_id': user.id,
            'vouchers': [voucher.barcode for voucher in vouchers],
            'logs': {
                'time': [log.time for log in logs],
                'from': [log.node_from for log in logs],
                'to': [log.node_to for log in logs],
                'sender_name': [sender.name for sender in senders],
                'sender_id': [sender.id for sender in senders],
                'receiver_name': [receiver.name for receiver in receivers],
                'receiver_id': [receiver.id for receiver in receivers],
                'comment': [log.comment for log in logs]
            }
        }

    if user_id:
        baskets = Basket.query.filter_by(user=user_id).all()
        if not baskets:
            return {'msg': '空'}
        barcodes = [basket.barcode for basket in baskets]
        return {
            'msg': '非空',
            'barcodes': barcodes
        }


def update(barcode, node='', user=''):
    basket = Basket.query.filter_by(barcode=barcode).first()
    comment = ''
    if node:
        comment += '流转'
    if user:
        comment += '交接'

    log = Log(
        basket=basket.id,
        node_from=basket.node,
        node_to=node if node else basket.node,
        sender=basket.user,
        receiver=user if user else basket.user,
        comment=comment
    )
    db.session.add(log)
    db.session.flush()
    db.session.commit()
    # 若成功添加了日志但是流转包信息没有成功更新如何回退？

    if node:
        basket.node = node
    if user:
        basket.user = user
    db.session.flush()
    db.session.commit()

    return {'msg': '更新成功'}


def checkVouchers(barcode, vouchers: list):
    basket = Basket.query.filter_by(barcode=barcode).first()
    old = Voucher.query.filter_by(basket=basket.id).all()
    old = set(o.barcode for o in old)
    vouchers = set(vouchers)

    # 找出差异
    missing = old - vouchers  # 在原集合中有但扫描中没有的凭证
    extra = vouchers - old  # 在扫描中有但原集合中没有的凭证

    return {
        'is_match': len(missing) == 0 and len(extra) == 0,
        'missing': list(missing),
        'extra': list(extra)
    }
