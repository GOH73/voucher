from sqlalchemy import desc

from app import db
from app.common import REJECT
from app.models import User, Application, Receipt, Basket


def inp(sender_id, receiver_id, application_id, application_status):
    sender = User.query.filter_by(id=sender_id).first()
    receiver = User.query.filter_by(id=receiver_id).first()
    application = Application.query.filter_by(id=application_id).first()
    receipt = Receipt(sender.id, receiver.id, application.id)

    db.session.add(receipt)
    application.status = application_status  # 1:同意 2:拒绝

    db.session.flush()
    db.session.commit()
    return {'msg': '回复成功'}


def get(receiver_id, receipt_id=''):
    if not receipt_id:
        receipts = Receipt.query.filter_by(receiver=receiver_id).order_by(desc(Receipt.time)).all()
        if not receipts:
            return {'msg': '没有回执消息'}

        applications = []
        receipts_id = []
        times = []
        applicants_id = []
        applicants_name = []
        for receipt in receipts:
            applications.append(Application.query.filter_by(id=receipt.application).first())
            receipts_id.append(receipt.id)
            times.append(receipt.time)
            applicants_id.append(receipt.sender)
            applicants_name.append(User.query.filter_by(id=receipt.sender).first().name)

        baskets_barcode = []
        nodes_to = []
        status = []
        for application in applications:
            applicants_id.append(application.id)
            baskets_barcode.append(Basket.query.filter_by(id=application.basket).first().barcode)
            nodes_to.append(application.new_node)
            status.append(application.status)

        return {
            'msg': '获取成功',
            'applications_id': receipts_id,  # 为了适配前端接口
            'applicants_id': applicants_id,
            'applicants_name': applicants_name,
            'times': times,
            'baskets_barcode': baskets_barcode,
            'nodes_to': nodes_to,
            'status': status,
            'type': ['receipt'] * len(receipts)
        }
