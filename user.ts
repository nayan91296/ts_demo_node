import { Table, Column, DataType, Model } from 'sequelize-typescript';

@Table({ tableName: "users", underscored: false, modelName: 'User', timestamps: false })
export class User extends Model {

  @Column({type:DataType.BIGINT, primaryKey: true, autoIncrement: true})
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column({
      type: DataType.TEXT,
      get() {
          let value: String = this.getDataValue('profile');
          if (value) {
              return 'localhost:3000/image/' +  value;
          }
      }
  })
  profile: string;

  // @Column(DataType.TEXT)
  // profile: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.TEXT)
  password: string;
}