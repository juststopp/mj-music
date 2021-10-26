import type Client from "../../main";
import { ButtonInteraction, User } from "discord.js";

class CommandHandler {
    client: typeof Client;

    constructor(client: typeof Client) {
        this.client = client;
    }

    async handle(interaction: ButtonInteraction) {
        if(interaction.user.bot || !interaction.inGuild()) return;
        
        if(interaction.guild.id !== this.client.config.discord.testGuild || interaction.channel.id !== this.client.config.discord.retraitChannel) return;
        const [action, userid, montant]: string[] = interaction.customId.split('-');
        const userDatas: any = await this.client.mysql.db.query(`SELECT * FROM user WHERE id='${userid}'`);
        const user: User = await this.client.users.fetch(userid);
        switch(action) {
            case 'accept': {
                await this.client.mysql.db.query(`UPDATE user SET en_attente=${userDatas[0][0].en_attente - Number(montant)} WHERE id='${userid}'`);
                // @ts-ignore
                interaction.message.delete();
                user.send(`:white_check_mark: **|** Votre demande de retrait pour un montant de **${montant}** a été acceptée. Vous devriez recevoir l'argent d'ici peu.`)
                break;
            }
            case 'reject':
            case 'delete': {
                await this.client.mysql.db.query(`UPDATE user SET en_attente=${userDatas[0][0].en_attente - Number(montant)}, argent=${userDatas[0][0].argent + Number(montant)} WHERE id='${userid}'`);
                // @ts-ignore
                interaction.message.delete();
                user.send(`:x: **|** Votre demande de retrait pour un montant de **${montant}** a été refusée. L'argent a été recrédité sur votre profile.`)
                break;
            }
        }
    }
}

export default CommandHandler;