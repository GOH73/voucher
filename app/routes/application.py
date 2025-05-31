from flask import Blueprint, request

from app.services.application_service import inp, get

bp = Blueprint('application', __name__)


@bp.route('/application/inp', methods=['POST'])
def apply():
    data = request.json
    barcode = data['barcode']
    node_to = data['node_to']
    applicant = data['applicant']
    return inp(barcode, node_to, applicant)


@bp.route('/application/get', methods=['GET'])
def get_applications():
    user = request.args.get('user_id')
    return get(user_id=user)


@bp.route('/application/count', methods=['GET'])
def count_applications():
    user = request.args.get('user_id')
    applications = get(user_id=user)
    if applications['msg'] == '没有申请消息':
        return {'num': 0}
    num = len(applications['times'])
    return {'num': num}
