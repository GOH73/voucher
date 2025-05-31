from app import db
from app.models import Node


def get(name=''):
    if not name:
        nodes = Node.query.all()
        result = []
        for n in nodes:
            if n.name != '起点':
                result.append(n.name)
        return {'nodes': result}


def inp(name='', description=''):
    if not name:
        return {'msg': '节点名不能为空'}, 403

    nodes = Node.query.filter_by(name=name).all()
    if nodes:
        return {'msg': '节点已存在'}, 403

    node = Node(name, description)
    db.session.add(node)
    db.session.flush()
    db.session.commit()

    return {'msg': '创建成功'}
