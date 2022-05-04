import { PersonalService } from "../../services/User/personal.service";
import { Prisma } from '../../configs/dbSync';

class PersonalController {
    static async createPersonal (req, res) {
        const {fname, lname, age } = req.body

        try {
            const Personal = await PersonalService.createPersonal({fname, lname, age: parseInt(age), userid: req.user, avatar: req.file.key + '.webp' });
            
            res.status(200).json(Personal);
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2002') return res.status(409).json({status: 'error', msg: 'Conflict when creating the personal.'})
                }

                console.log(e)
                return res.status(500).json({statsus: 'error', msg: 'Internal Server Error.'})
        }
    }
};

export { PersonalController }