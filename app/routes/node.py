from flask import Blueprint, request

from app.services.node_service import get, inp

bp = Blueprint('node', __name__)


@bp.route('/node/all', methods=['GET'])
def all_nodes():
    return get()


@bp.route('/node/inp', methods=['POST'])
def new_node():
    data = request.json
    return inp(data['node_name'], data['description'])
