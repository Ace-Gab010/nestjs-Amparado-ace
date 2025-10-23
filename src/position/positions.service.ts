import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';


@Injectable()
export class PositionService {
    constructor(private db: DatabaseService) {}
    private pool = () => this.db.getPool();

    async create(position_code: string, position_name: string, userId: number) {

        const [result] = await this.pool().execute<OkPacket>(
            `INSERT INTO positions (positions_code, positions_name, id) VALUES(?, ?, ?)`,
            [position_code, position_name, userId],
        );
        return { positions_id: result.insertId, positions_code: position_code, positions_name: position_name, id: userId  };
    }


    async findByPosition_id(position_id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT positions_id, positions_code, positions_name, id, created_at, updated_at FROM positions WHERE positions_id = ?`,
            [position_id],
        );
        return rows[0];
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT positions_id, positions_code, positions_name, id, created_at,  updated_at FROM positions`,
        );
        return rows;
    }

    async updatePosition(position_id: number, partial: { positions_code?: string; positions_name?: string}) {
        const fields: string[] = [];
        const values: any[] = [];
        if (partial.positions_code) {
            fields.push(`positions_code = ?`);
            values.push(partial.positions_code);
        }
        if (partial.positions_name) {
            fields.push(`positions_name = ?`);
            values.push(partial.positions_name);
        }

        if (fields.length === 0) return await this.findByPosition_id(position_id);
        values.push(position_id);
        const sql = `UPDATE positions SET ${fields.join(`, `)} WHERE positions_id = ?`;
        await this.pool().execute(sql, values);
        return this.findByPosition_id(position_id);
    }

    async deletePosition(position_id: number) {
        const [res] = await this.pool().execute<OkPacket>(`DELETE FROM positions WHERE positions_id = ?`, [position_id]);
        if (res.affectedRows > 0){
            return{message: "success"}
        }
    }

}