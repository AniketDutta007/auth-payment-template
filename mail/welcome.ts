import { createTransport } from 'nodemailer';

const transport = createTransport({
	host: process.env.EMAIL_SERVER_HOST,
	port: Number(process.env.EMAIL_SERVER_PORT),
	secure: false,
	auth: {
		// TODO: replace `user` and `pass` values from <https://forwardemail.net>
		user: process.env.EMAIL_SERVER_USER,
		pass: process.env.EMAIL_SERVER_PASSWORD,
	},
});

export async function sendWelcomeEmail(name: string, email: string) {
	const { host } = new URL(process.env.APP_URL || 'http://localhost'); // Ensure to set up APP_URL or default to localhost

	const result = await transport.sendMail({
		to: email,
		from: process.env.EMAIL_SERVER_USER, // or any default sender you have
		subject: `Welcome to ${host}`,
		text: welcomeText({ name, host: 'Unstudio' }),
		html: welcomeHtml({ name, host: 'Unstudio' }),
	});
	console.log(result);

	const failed = result.rejected.concat(result.pending).filter(Boolean);
	if (failed.length) {
		throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
	}
}

function welcomeHtml(params: { name: string; host: string }) {
	const { name, host } = params;
	return `
 <body>
   <table width="100%" border="0" cellspacing="20" cellpadding="0"
     style="max-width: 600px; margin: auto; border-radius: 10px;">
     <tr>
       <td align="center"
         style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif;">
         Welcome, ${name}!
       </td>
     </tr>
     <tr>
       <td align="center"
         style="padding: 20px 0; font-size: 18px; font-family: Helvetica, Arial, sans-serif;">
         We're delighted to have you join <strong>${host}</strong>. Dive in and explore!
       </td>
     </tr>
   </table>
 </body>
 `;
}

function welcomeText(params: { name: string; host: string }) {
	const { name, host } = params;
	return `Welcome, ${name}!\nWe're delighted to have you join ${host}. Dive in and explore!\n\n`;
}
