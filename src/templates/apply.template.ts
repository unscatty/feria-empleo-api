import { config } from 'dotenv';
import { Candidate } from 'src/modules/candidate/models/candidate.entity';

config();

export function getApplyTemplate(candidate: Candidate, jobPost: string): string {
  const profileUrl = `${process.env.CLIENT_URL}/profiles/${candidate.id}`;
  return `
    A través del portal de la feria del empleo de ESCOM el candidato ${candidate.user.name} se ha interesado por la vacante: ${jobPost} \n
    Si está interesado en su perfil, favor de contactar al siguiente email: ${candidate.user.email} o bien por algún otro método
    especificado en el CV que puede descargar <a href="${candidate.resume}">aquí</a>.

    Tambien puede visitar su <a href="${profileUrl}">perfil</a> en el portal de la feria.
    `;
}
