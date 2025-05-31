from sqlalchemy import desc

from app import db
from app.models import Application, Basket, User


def inp(barcode, node_to, applicant):
    basket = Basket.query.filter_by(barcode=barcode).first()
    application = Application(
        applicant=applicant,
        checker=basket.user,
        new_node=node_to,
        basket=basket.id
    )
    db.session.add(application)
    db.session.flush()
    db.session.commit()

    return {'msg': '发送成功'}


def get(user_id, application_id=''):
    if not application_id:
        applications = Application.query.filter_by(checker=user_id).order_by(desc(Application.time)).all()
        if not applications:
            return {'msg': '没有申请消息'}
        applicants = [User.query.filter_by(id=a.applicant).first() for a in applications]
        applicants_name = [a.name for a in applicants]
        applicants_id = [a.id for a in applicants]
        times = [a.time for a in applications]
        baskets_id = [a.basket for a in applications]
        baskets = [Basket.query.filter_by(id=bid).first() for bid in baskets_id]
        baskets_barcode = [b.barcode for b in baskets]
        nodes_to = [a.new_node for a in applications]
        status = [a.status for a in applications]

        return {
            'msg': '获取成功',
            'applications_id': [a.id for a in applications],
            'applicants_id': applicants_id,
            'applicants_name': applicants_name,
            'times': times,
            'baskets_barcode': baskets_barcode,
            'nodes_to': nodes_to,
            'status': status,
            'type': ['application'] * len(applications)  # 标注消息类型
        }
    application = Application.query.filter_by(id=application_id, checker=user_id).first()
    if not application:
        return {'msg': '没有此申请'}

    return {
        'msg': '获取成功',
        'application_id': application.id,
        'applicant': application.applicant,
        'applicant_name': User.query.filter_by(id=application.applicant).first().name,
        'time': application.time,
        'basket_barcode': Basket.query.filter_by(id=application.basket).first().barcode,
        'node_to': application.new_node,
        'status': application.status,
        'type': 'application'
    }
