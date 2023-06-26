import {
	BelongsTo,
	Column,
	DataType,
	Model,
	Table
} from 'sequelize-typescript';
import { User } from './User';

type TokenAttr = {
	id: string;
	userId: string;
	refreshToken: string;
};

type TokenCreateAttr = Omit<TokenAttr, 'id'>;

@Table({ tableName: 'tokens', timestamps: false })
class Token extends Model<TokenAttr, TokenCreateAttr> {
	@Column({
		primaryKey: true,
		allowNull: false,
		unique: true,
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4
	})
	id: string;

	@Column({ allowNull: false })
	refreshToken: string;

	@BelongsTo(() => User, { foreignKey: 'userId', constraints: false })
	user: User;
}

export { Token };
