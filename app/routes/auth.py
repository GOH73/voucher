from flask import Blueprint, request, jsonify
from app.services.auth_service import get_verification_code, validate_code, wx_login

bp = Blueprint('auth', __name__)


@bp.route('/wx/code', methods=['POST'])
def get_code():
    phone = request.json['phone']
    code = get_verification_code(phone)
    print(code)
    return jsonify({'message': '验证码已发送', 'code': code})


@bp.route('/wx', methods=['POST'])
def wx_login_route():
    """将POST数据中的 phone 字段和 code 字段传入wx_login函数进行登录操作
    """
    data = request.json
    if data['type'] == 'password':
        return wx_login(data['phone'], password=data['password'])

    if not validate_code(data['code']):
        return jsonify({'message': '无效的验证码'})
    return wx_login(data['phone'], code=data['code'])
