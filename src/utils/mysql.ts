import Client from "../../main";
import { Pool, createPool } from "mysql2/promise";
import { Snowflake } from "discord-api-types";

class MySQL {
    client: typeof Client;
    db: Pool;

    constructor(client: typeof Client) {
        this.client = client;
        this.db = createPool(client.config.mysql)
    }

    async FOCUser(_id: Snowflake): Promise<void> {
        let user: any = await this.db.query(`SELECT * FROM user WHERE id='${_id}'`);
        if(!user[0][0]) await this.db.query(`INSERT INTO user(id) VALUES('${_id}')`);
    }

}

export default MySQL;