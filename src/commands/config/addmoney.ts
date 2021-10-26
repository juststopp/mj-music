import Command from '../../utils/Command';
import Context from '../../utils/Context';

class AddMoney extends Command {
    constructor() {
        super({
            name: "addmoney",
            category: "admin",
            description: "Ajouter de l'argent à un utilisateur.",
            options: [
                {
                    type: "USER",
                    name: "utilisateur",
                    description: "L'utilisateur à qui vous voulez ajouter de l'argent.",
                    required: true,
                },
                {
                    type: "NUMBER",
                    name: "montant",
                    description: "Montant à ajouter à l'utilisateur.",
                    required: true,
                }
            ],
            ownerOnly: true,
            examples: ["addmoney @JustStop__ 150"]
        })
    }

    async run(ctx: Context) {
        const userDatas: any = await ctx.client.mysql.db.query(`SELECT * FROM user WHERE id='${ctx.args.getUser("utilisateur").id}'`);
        await ctx.client.mysql.db.query(`UPDATE user SET argent=${ctx.args.getNumber("montant") + userDatas[0][0].argent} WHERE id='${ctx.args.getUser("utilisateur").id}'`);
        ctx.reply({content: `Vous avez ajouté \`${ctx.args.getNumber("montant")}\`€ sur le compte de ${ctx.args.getUser("utilisateur")}`})
    }
}

module.exports = new AddMoney();