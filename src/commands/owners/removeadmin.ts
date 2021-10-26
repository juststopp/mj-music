import Command from '../../utils/Command';
import Context from '../../utils/Context';

class RemoveAdmin extends Command {
    constructor() {
        super({
            name: "removeadmin",
            category: "admins",
            description: "Retirer un admin de la liste.",
            options: [
                {
                    type: "USER",
                    name: "utilisateur",
                    description: "Utilisateur que vous souhaitez retirer de la liste.",
                    required: true,
                },
            ],
            ownerOnly: true,
            examples: ["removeadmin @JustStop__"]
        })
    }

    async run(ctx: Context) {
        await ctx.client.mysql.db.query(`UPDATE user SET admin='false' WHERE id='${ctx.args.getUser("utilisateur").id}'`)
        ctx.reply({content: `Vous avez correctement retiré ${ctx.args.getUser("utilisateur")} de la liste des admins.`})
    }
}

module.exports = new RemoveAdmin();