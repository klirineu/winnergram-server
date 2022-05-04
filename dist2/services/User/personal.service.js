import createError from "http-errors";
import { dbSync } from "../../configs/dbSync";

class PersonalService {
    static async createPersonal(data) {
        const { fname, lname, age, avatar, userid } = data;
        let Personal = await dbSync.accounts.update({
            where: {
                id: userid,
            },
            data: {
                Settings: {
                    create: {
                        follows: true,
                        comments: true,
                        likes: true,
                        messages: true,
                    },
                },
                Personal: {
                    create: {
                        fname: fname,
                        lname: lname,
                        age: age,
                        avatar: avatar,
                    },
                },
            },
        });
        Personal.password = undefined;

        return Personal;
    }
}

export { PersonalService };
