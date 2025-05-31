from flask import Blueprint, request

from app.services.auth_service import update_profile

bp = Blueprint('user', __name__)


@bp.route('/user/update', methods=['POST'])
def edit():
    data = request.json
    user_id = data['user_id']
    name = data.get('name')  # 如果键不存在返回 None
    phone = data.get('phone')
    new_passwd = data.get('new_passwd')
    old_passwd = data.get('old_passwd')
    return update_profile(user_id=user_id, new_name=name, new_phone=phone, new_passwd=new_passwd, old_passwd=old_passwd)
