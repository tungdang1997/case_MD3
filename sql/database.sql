use quanlybanhang;

create table users(
                      id int not null auto_increment primary key ,
                      name varchar(100),
                      password varchar(100)
);
create table category(
                         id int not null auto_increment primary key ,
                         image text
);
create table products(
                         id int not null auto_increment primary key ,
                         name varchar(100),
                         price int,
                         quantity int,
                         idCategory int,
                         foreign key (idCategory) references category(id)
);
create table `order`(
                        id int not null auto_increment primary key ,
                        total int,
                        idUser int,
                        foreign key (idUser) references users(id)
);
create table orderDetail(
                            quantity int,
                            idOrder int,
                            idProduct int,
                            foreign key (idOrder) references `order`(id),
                            foreign key (idProduct) references products(id)
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';