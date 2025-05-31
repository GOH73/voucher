from app import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __init__(self, phone, **kwargs):
        """
        初始化用户对象

        :param phone: 用户手机号（唯一标识）
        :param password: 用户明文密码（自动加密存储）
        :param kwargs: 其他字段参数
        """
        super(User, self).__init__(**kwargs)
        self.phone = phone
        self.set_password(phone)
        self.name = phone[-4:]

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Node(db.Model):
    __tablename__ = 'node'
    name = db.Column(db.String(100), primary_key=True)
    description = db.Column(db.String(255))

    def __init__(self, name, description=None):
        self.name = name
        self.description = description


class Basket(db.Model):
    __tablename__ = 'basket'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    barcode = db.Column(db.String(50), unique=True, nullable=False)
    node = db.Column(db.Integer, db.ForeignKey('node.name'))
    user = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, barcode, node, user, **kwargs):
        super(Basket, self).__init__(**kwargs)
        self.barcode = barcode
        self.node = node
        self.user = user


class Voucher(db.Model):
    __tablename__ = 'voucher'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    barcode = db.Column(db.String(50), unique=True, nullable=False)
    basket = db.Column(db.Integer, db.ForeignKey('basket.id'))

    def __init__(self, barcode, basket, **kwargs):
        super(Voucher, self).__init__(**kwargs)
        self.barcode = barcode
        self.basket = basket


class Log(db.Model):
    __tablename__ = 'log'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    basket = db.Column(db.Integer, db.ForeignKey('basket.id'))
    time = db.Column(db.TIMESTAMP, server_default='CURRENT_TIMESTAMP')
    node_from = db.Column(db.String(50), db.ForeignKey('node.name'))
    node_to = db.Column(db.String(50), db.ForeignKey('node.name'))
    sender = db.Column(db.Integer, db.ForeignKey('user.id'))
    receiver = db.Column(db.Integer, db.ForeignKey('user.id'))
    comment = db.Column(db.String(50))

    def __init__(self, basket, node_from, node_to, sender, receiver, comment='', **kwargs):
        super(Log, self).__init__(**kwargs)
        self.basket = basket
        self.node_from = node_from
        self.node_to = node_to
        self.sender = sender
        self.receiver = receiver
        self.comment = comment


class Application(db.Model):
    __tablename__ = 'application'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    applicant = db.Column(db.Integer, db.ForeignKey('user.id'))
    checker = db.Column(db.Integer, db.ForeignKey('user.id'))
    time = db.Column(db.TIMESTAMP, server_default='CURRENT_TIMESTAMP')
    new_node = db.Column(db.String(100), db.ForeignKey('node.name'))
    basket = db.Column(db.Integer, db.ForeignKey('basket.id'))
    status = db.Column(db.Integer, nullable=False, default=0)

    def __init__(self, applicant, checker, new_node, basket, **kwargs):
        super(Application, self).__init__(**kwargs)
        self.applicant = applicant
        self.checker = checker
        self.new_node = new_node
        self.basket = basket


class Receipt(db.Model):
    __tablename__ = 'receipt'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender = db.Column(db.Integer, db.ForeignKey('user.id'))
    receiver = db.Column(db.Integer, db.ForeignKey('user.id'))
    time = db.Column(db.TIMESTAMP, server_default='CURRENT_TIMESTAMP')
    application = db.Column(db.Integer, db.ForeignKey('application.id'))

    def __init__(self, sender, receiver, application, **kwargs):
        super(Receipt, self).__init__(**kwargs)
        self.sender = sender
        self.receiver = receiver
        self.application = application
