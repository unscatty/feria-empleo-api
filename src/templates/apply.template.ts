import { User } from 'src/modules/user/entities/user.entity';
import { config } from 'dotenv';

config();

export function getApplyTemplate(user: User, jobPost: string): string {
  const profileUrl = `${process.env.CLIENT_URL}/profiles/${user.candidate.id}`;
  return `
    A través del portal de la feria del empleo de ESCOM el candidato ${user.candidate.name} se ha interesado por la vacante: ${jobPost} \n
    Si está interesado en su perfil, favor de contactar al siguiente email: ${user.email} o bien por algún otro método
    especificado en el CV que puede descargar <a href="${user.candidate.resume}">aquí</a>.

    Tambien puede visitar su <a href="${profileUrl}">perfil</a> en el portal de la feria.
    `;
}
