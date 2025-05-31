from flask import Blueprint, request

from app.services.application_service import get as get_application
from app.services.receipt_service import get as get_receipt

bp = Blueprint('msg', __name__)


@bp.route('/msg/count', methods=['GET'])
def count_msg():
    user = request.args.get('user_id')
    applications = get_application(user_id=user)
    if applications['msg'] == '没有申请消息':
        count = 0
    else:
        count = len(applications['times'])

    receipts = get_receipt(receiver_id=user)
    if receipts['msg'] != '没有回执消息':
        count += len(receipts['times'])

    return {'num': count}
