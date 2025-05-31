import random
import re

from flask import jsonify

from app import db
from app.models import User

# 模拟验证码发送
verification_codes = {}


def get_verification_code(phone):
    if not re.match(r'^1[3-9]\d{9}$', phone):
        return '手机号格式错误'
    code = random.randint(1000, 9999)
    verification_codes[phone] = code
    return code


def wx_login(phone, code='', password=''):
    if code and verification_codes.get(phone) != int(code):
        return jsonify({'msg': '验证码错误'}), 400

    # 查询用户逻辑
    user = User.query.filter_by(phone=phone).first()
    if not user:
        if not code:
            return {'msg': '初次登录请使用验证码注册'}, 400
        # 若没有该用户，直接新建，用户密码与手机号相同
        user = User(phone=phone)
        db.session.add(user)
        db.session.commit()

    if password:
        if not user.check_password(password):
            return {'msg': '密码错误'}, 400

    return jsonify({
        'msg': '验证成功',
        'user_info': {
            'user_id': user.id,
            'user_name': user.name,
            'phone_number': user.phone
        }
    })


def validate_code(code: str):
    if not re.match(r'^[1-9]\d{3}$', code):
        return False
    return True


def update_profile(user_id, new_name, new_phone, new_passwd, old_passwd):
    user = User.query.filter_by(id=user_id).first()
    if new_name:
        user.name = new_name

    if new_phone:
        user.phone = new_phone

    msg = '修改成功'
    if new_passwd:
        if not user.check_password(old_passwd):
            msg = '密码错误'
        else:
            user.set_password(new_passwd)

    db.session.flush()
    db.session.commit()

    return {'msg': msg}
