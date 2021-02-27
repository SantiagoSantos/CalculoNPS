import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController{
    async create(req: Request, res: Response){
        const {name, email} = req.body;

        const schema = yup.object().shape({
            name: yup.string().required("Please send a valid name."),
            email: yup.string().required("Please send a valid e-mail.")
        });

        try {
            await schema.validate(req.body, {abortEarly: false})
        } catch (error) {
            throw new AppError(error);
        }
        

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email,
        });

        if (userAlreadyExists) {
            throw new AppError(`Hmmmm... E-mail ${email} já existe na base de dados.`);
        }         

        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save(user);

        return res.status(201).json(user);
    }
}

export { UserController };
