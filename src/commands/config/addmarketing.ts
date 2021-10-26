import Command from '../../utils/Command';
import Context from '../../utils/Context';

class AddMarketing extends Command {
    constructor() {
        super({
            name: "addmarketing",
            category: "admins",
            description: "Ajouter un marketing à la liste.",
            options: [
                {
                    type: "USER",
                    name: "utilisateur",
                    description: "Utilisateur que vous souhaitez ajouter à la liste.",
                    required: true,
                },
            ],
            adminOnly: true,
            examples: ["addmarketing @JustStop__"]
        })
    }

    async run(ctx: Context) {
        await ctx.client.mysql.db.query(`UPDATE user SET marketing='true' WHERE id='${ctx.args.getUser("utilisateur").id}'`)
        ctx.reply({content: `Vous avez correctement ajouté ${ctx.args.getUser("utilisateur")} à la liste des marketings.`})
    }
}

module.exports = new AddMarketing();