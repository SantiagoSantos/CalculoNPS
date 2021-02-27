import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveyUserRepository';
import { AppError } from '../errors/AppError';

class AnswerController {
    
    async execute(request: Request, response: Response){
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersReposytory = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersReposytory.findOne({
            id: String(u)
        });

        if (!surveyUser) {
            throw new AppError("Survey does not exists.");
        }        

        surveyUser.value = Number(value);

        await surveysUsersReposytory.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { AnswerController }