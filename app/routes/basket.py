import os

from flask import Blueprint, request
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from app.services.basket_service import inp, get, update, checkVouchers, insert
from flask import send_file
from reportlab.pdfgen import canvas
from io import BytesIO

bp = Blueprint('basket', __name__)
# 注册字体
font_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'fonts', 'simfang.ttf')
pdfmetrics.registerFont(TTFont('CustomFont', font_path))


@bp.route('/basket/input', methods=['POST'])
def new_basket():
    data = request.json
    return inp(data['barcode'], data['node'], data['user'])


@bp.route('/basket/get', methods=['GET'])
def specified_basket():
    barcode = request.args.get('barcode')
    if not str(barcode).isdigit():
        return {'msg': '无效的条形码'}, 400
    return get(barcode=barcode)


@bp.route('/basket/mine', methods=['GET'])
def my_basket():
    user_id = request.args.get('user_id')
    return get(user_id=user_id)


@bp.route('/basket/update_node', methods=['POST'])
def update_node():
    data = request.json
    barcode = data['barcode']
    node_to = data['node_to']
    return update(barcode, node_to)


@bp.route('/basket/handover', methods=['POST'])
def handover():
    data = request.json
    vouchers = data['vouchers']
    barcode = data['barcode']
    check_res = checkVouchers(barcode=barcode, vouchers=vouchers)
    if not check_res['is_match']:
        return {
            'msg': '凭证清单不匹配',
            'check_res': check_res
        }

    new_node = data['node_to']
    new_user = data['to_user']

    return update(barcode=barcode, node=new_node, user=new_user)


@bp.route('/basket/insert', methods=['POST'])
def new_vouchers():
    data = request.json
    user = data['user_id']
    barcode = data['basket_code']
    vouchers = data['vouchers']
    return insert(user, barcode, vouchers)


@bp.route('/basket/generate_pdf', methods=['POST'])
def generate_pdf():
    data = request.json

    # 创建PDF文件
    buffer = BytesIO()
    p = canvas.Canvas(buffer)

    # 添加标题
    p.setFont("CustomFont", 16)
    p.drawString(50, 800, f"流转包交接清单")

    # 添加基本信息
    p.setFont("CustomFont", 16)
    p.drawString(50, 750, f"流转包编号：{data['basket_code']}")
    p.drawString(50, 730, f"交接前位置：{data['current_location']}")
    p.drawString(50, 710, f"交接后位置：{data['target_location']}")
    p.drawString(50, 690, f"交接时间：{data['handover_time']}")
    p.drawString(50, 670, f"接收人：{data['handler']}")

    # 添加凭证列表
    p.drawString(50, 630, "凭证列表：")
    y = 610
    for voucher in data['vouchers']:
        p.drawString(70, y, voucher)
        y -= 20
        if y < 50:  # 如果页面空间不足，创建新页
            p.showPage()
            p.setFont("CustomFont", 16)
            y = 800

    p.save()
    buffer.seek(0)

    return send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"handover_{data['basket_code']}.pdf"
    )
