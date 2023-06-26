import { Column, Model, Table, DataType } from 'sequelize-typescript';

type UserAttr = {
	id: string;
	email: string;
	name: string;
	password: string;
};

type UserCreateAttr = Omit<UserAttr, 'id'>;

@Table({ timestamps: false, tableName: 'users' })
class User extends Model<UserAttr, UserCreateAttr> {
	@Column({
		primaryKey: true,
		allowNull: false,
		unique: true,
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4
	})
	id: string;

	@Column({ allowNull: false })
	name: string;

	@Column({ allowNull: false })
	password: string;

	@Column({ allowNull: false })
	email: string;
}

export { User };
