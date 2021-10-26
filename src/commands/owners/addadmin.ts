import Command from '../../utils/Command';
import Context from '../../utils/Context';

class AddAdmin extends Command {
    constructor() {
        super({
            name: "addadmin",
            category: "admins",
            description: "Ajouter un admin à la liste.",
            options: [
                {
                    type: "USER",
                    name: "utilisateur",
                    description: "Utilisateur que vous souhaitez ajouter à la liste.",
                    required: true,
                },
            ],
            ownerOnly: true,
            examples: ["addadmin @JustStop__"]
        })
    }

    async run(ctx: Context) {
        await ctx.client.mysql.db.query(`UPDATE user SET admin='true' WHERE id='${ctx.args.getUser("utilisateur").id}'`)
        ctx.reply({content: `Vous avez correctement ajouté ${ctx.args.getUser("utilisateur")} à la liste des admins.`})
    }
}

module.exports = new AddAdmin();