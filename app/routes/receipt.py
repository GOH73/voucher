from flask import Blueprint, request

from app.services.receipt_service import inp, get

bp = Blueprint('receipt', __name__)


@bp.route('/receipt/input', methods=['POST'])
def new_receipt():
    data = request.json
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    application_id = data['application_id']
    status = data['status']
    return inp(sender_id, receiver_id, application_id, status)


@bp.route('/receipt/get', methods=['GET'])
def get_receipt():
    user = request.args.get('user_id')
    return get(receiver_id=user)
