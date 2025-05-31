-- 用户表：存储使用人员信息，包括姓名、手机号码、密码
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL COMMENT '加密后的密码'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 节点表
CREATE TABLE IF NOT EXISTS node (
    `name` VARCHAR(100) PRIMARY KEY,
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 篮子表
CREATE TABLE IF NOT EXISTS basket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(50) NOT NULL UNIQUE,
    node VARCHAR(100) NOT NULL,
    user INT NOT NULL,
    FOREIGN KEY (node) REFERENCES node(`name`),
    FOREIGN KEY (user) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 凭证表
CREATE TABLE IF NOT EXISTS voucher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(50) NOT NULL UNIQUE,
    basket INT NOT NULL COMMENT '篮子的id',
    FOREIGN KEY (basket) REFERENCES basket(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--  流转包日志，一个流转包的所有日志汇集成一个路线
CREATE TABLE IF NOT EXISTS log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    basket INT NOT NULL COMMENT '篮子的id',
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    node_from VARCHAR(100) NOT NULL,
    node_to VARCHAR(100) NOT NULL,
    sender INT NOT NULL,
    receiver INT NOT NULL,
    comment VARCHAR(100),
    FOREIGN KEY (basket) REFERENCES basket(id),
    FOREIGN KEY (node_from) REFERENCES node(`name`),
    FOREIGN KEY (node_to) REFERENCES node(`name`),
	FOREIGN KEY (sender) REFERENCES user(id),
	FOREIGN KEY (receiver) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 发送交接（流转）申请
CREATE TABLE IF NOT EXISTS application (
	id INT AUTO_INCREMENT PRIMARY KEY,
	applicant INT NOT NULL,
	checker INT NOT NULL,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	new_node VARCHAR(100) NOT NULL,
	basket INT NOT NULL,
	status INT NOT NULL DEFAULT 0,
	FOREIGN KEY (applicant) REFERENCES user(id),
	FOREIGN KEY (checker) REFERENCES user(id),
	FOREIGN KEY (new_node) REFERENCES node(`name`),
	FOREIGN KEY (basket) REFERENCES basket(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 回执信息
CREATE TABLE IF NOT EXISTS receipt (
	id INT AUTO_INCREMENT PRIMARY KEY,
	sender INT NOT NULL,
	receiver INT NOT NULL,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	application INT NOT NULL,
	FOREIGN KEY (sender) REFERENCES user(id),
	FOREIGN KEY (receiver) REFERENCES user(id),
	FOREIGN KEY (application) REFERENCES application(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入基础数据
INSERT INTO node (name, description)
VALUES
('科研经费核算科', '科研凭证（红K）'),
('综合科', '理单-装订-归档'),
('财务科', '记账凭证（绿J）'),
('资金科', '需要支付的凭证'),
('起点', '装包时设置');

INSERT INTO user (id, name, phone, password)
VALUES
    (-1,'系统用户','0','0');
