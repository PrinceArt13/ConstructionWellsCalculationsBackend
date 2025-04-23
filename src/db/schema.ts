import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface Constants {
    id: number;
    name: string;
    value: number;
    unit: string;
}

export type Database = {
    constants: Constants;
}