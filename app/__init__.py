from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from config import Config

# 初始化数据库和迁移
db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)

    # 注册蓝图（路由）
    from app.routes import auth, voucher, node, basket, application, receipt, msg, user
    app.register_blueprint(auth.bp)
    app.register_blueprint(voucher.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(node.bp)
    app.register_blueprint(basket.bp)
    app.register_blueprint(application.bp)
    app.register_blueprint(receipt.bp)
    app.register_blueprint(msg.bp)

    return app
