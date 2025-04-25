import crypto from 'crypto';

export  const encrypt = async (password:any) => {
    if (password != undefined) {
        const algorithm = process.env.ALGORITHM || "";
        const secret_key = process.env.SALT || "" ;
        const secret_iv = process.env.IV || "" ;

        const key = crypto.createHash('sha512').update(secret_key, 'utf-8').digest('hex').substring(0, 32);
        const iv = crypto.createHash('sha512').update(secret_iv, 'utf-8').digest('hex').substring(0, 16);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(String(password), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        console.log (encrypted)
        return encrypted;
    } else {
        throw new Error('Password is required');
    }
};