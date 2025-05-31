from flask import Blueprint, request

from app.models import Basket
from app.services.voucher_service import inp, get

bp = Blueprint('voucher', __name__)


@bp.route('/voucher/input', methods=['POST'])
def new_voucher():
    data = request.json
    basket = Basket.query.filter_by(barcode=data['basket']).first()
    return inp(data['barcode'], basket.id)


@bp.route('/voucher/query', methods=['GET'])
def specified_voucher():
    data = request.args.get('barcode')
    return get(data)
