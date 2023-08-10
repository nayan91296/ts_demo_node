import { Sequelize } from 'sequelize-typescript';
import { User } from './model/user';
import { Post } from './model/post';

const sequelizeInstance = new Sequelize({
  host: "127.0.0.1",
  database: 'ts_demo_node',
  username: "root",
  password: "",
  dialect: "mysql",
  logging: false,
});

sequelizeInstance.addModels([User,Post]);

export default sequelizeInstance;
