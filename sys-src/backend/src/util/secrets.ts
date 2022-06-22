import fs from 'fs/promises';
import { constants } from 'fs';

async function getSecret(name: string): Promise<string | undefined> {
    const filename = `/run/secrets/${name}`;
    try {
        await fs.access(filename, constants.R_OK);
        const data = await fs.readFile(filename);
        return data.toString('utf-8');
    }
    catch (e: any) {
        console.log('error reading a secret', e);
        return undefined;
    }
}

export default getSecret;