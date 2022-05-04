"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _mailer = require('../lib/mailer'); var _mailer2 = _interopRequireDefault(_mailer);

exports. default = {
	key: 'RegistrationMailJob',
	async handle(data) {
		const { id, uniquehash, name, email } = data.data;
		_mailer2.default.sendMail({
			to: `${name} < ${email} >`,
			from: 'Winnegram <noreply@winnegram.com.br>',
			subject: 'Confirme a sua conta Winnegram',
			html: `
				<head>
				<style> main{ font-family: sans-serif; max-width: 360px; margin: auto; display: flex; flex-direction: column; align-items: center; background-color: #F6F6F6; padding: 20px; border-radius: 10px; } main > img{ width: 50%; } main > a{ margin: 20px 0; text-decoration: none; background-color: #3CAEFC; color: #fff; padding: 10px 40px; border-radius: 10px; font-weight: 500; } main > span { margin-top: 40px; align-self: flex-start; } </style>
				</head>
				<main>
					<img src="https://media.discordapp.net/attachments/925576130549927946/929153735182147665/logo-cut.png" alt="brand">
					<h1>Finalize seu cadastro</h1>
					<p>Olá, <b>${name}</b>, Obrigado por se cadastrar no Winnergram. Verifique sua conta acessando o link abaixo.</p>
					<a href="https://winnergram.vercel.app/confirm/${uniquehash}/${id}">Confirmar e-mail</a>
                    <p>Caso não tenha feito o cadastro, ignore este e-mail.</p>		
				</main>
			`
		});
	}
};