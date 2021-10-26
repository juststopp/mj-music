import Command from '../../utils/Command';
import Context from '../../utils/Context';

class RemoveMarketing extends Command {
    constructor() {
        super({
            name: "removemarketing",
            category: "admins",
            description: "Retirer un marketing de la liste.",
            options: [
                {
                    type: "USER",
                    name: "utilisateur",
                    description: "Utilisateur que vous souhaitez retirer de la liste.",
                    required: true,
                },
            ],
            adminOnly: true,
            examples: ["removemarketing @JustStop__"]
        })
    }

    async run(ctx: Context) {
        await ctx.client.mysql.db.query(`UPDATE user SET marketing='false' WHERE id='${ctx.args.getUser("utilisateur").id}'`)
        ctx.reply({content: `Vous avez correctement retiré ${ctx.args.getUser("utilisateur")} de la liste des marketings.`})
    }
}

module.exports = new RemoveMarketing();