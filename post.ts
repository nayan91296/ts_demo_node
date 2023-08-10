import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user'; // Import User model

@Table({ tableName: "posts", underscored: false, modelName: 'Post', timestamps: false })
export class Post extends Model {

  @Column({type:DataType.BIGINT, primaryKey: true, autoIncrement: true})
  id: number;

  @Column(DataType.STRING)
  title: string;

 
}