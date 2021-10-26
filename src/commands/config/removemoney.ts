import Command from '../../utils/Command';
import Context from '../../utils/Context';

class RemoveMoney extends Command {
    constructor() {
        super({
            name: "removemoney",
            category: "admin",
            description: "Retirer de l'argent à un utilisateur.",
            options: [
                {
                    type: "USER",
                    name: "utilisateur",
                    description: "L'utilisateur à qui vous voulez retirer de l'argent.",
                    required: true,
                },
                {
                    type: "NUMBER",
                    name: "montant",
                    description: "Montant à retirer à l'utilisateur.",
                    required: true,
                }
            ],
            ownerOnly: true,
            examples: ["removemoney @JustStop__ 150"]
        })
    }

    async run(ctx: Context) {
        const userDatas: any = await ctx.client.mysql.db.query(`SELECT * FROM user WHERE id='${ctx.args.getUser("utilisateur").id}'`);
        if(userDatas[0][0].argent < ctx.args.getNumber("montant")) return ctx.reply({content: `L'utilisateur n'a pas autant d'argent. Il possède actuellement \`${userDatas[0][0].argent}\`€ sur son compte.`})
        await ctx.client.mysql.db.query(`UPDATE user SET argent=${userDatas[0][0].argent - ctx.args.getNumber("montant")} WHERE id='${ctx.args.getUser("utilisateur").id}'`);
        ctx.reply({content: `Vous avez retiré \`${ctx.args.getNumber("montant")}\`€ du compte de ${ctx.args.getUser("utilisateur")}`})
    }
}

module.exports = new RemoveMoney();