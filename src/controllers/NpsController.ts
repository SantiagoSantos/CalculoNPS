import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveyUserRepository';

/*
    Detratores => 0 - 6
    Passivos (Neutros) => 7 - 8
    Promotores => 9 - 10

    Fórmula: (promotores - detratores) / número de respostas * 100;
*/

class NpsController{
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,  
            value: Not(IsNull())     
        });

        const detractor = surveysUsers.filter(survey => 
            survey.value <= 6
        ).length;

        const promoter = surveysUsers.filter(survey => 
            survey.value >= 9
        ).length;

        const passive = surveysUsers.filter(survey => 
            survey.value > 6 && survey.value < 9    
        ).length;

        const totalAnswers = surveysUsers.length;

        const calculate = Number(((promoter - detractor) / totalAnswers * 100).toFixed(2));

        return response.json({
            detractor,
            promoter,
            passive,
            totalAnswers,
            nps: calculate,
            avaliação: getStatusNps(calculate)
        })
    }
    
}

function getStatusNps(valor:Number) {
    if (valor >= 75) {
        return 'Excelente';
    }
    else if(valor >= 50){
        return 'Muito bom';
    }
    else if (valor >= 0) {
        return 'Razoável';
    }
    else{
        return 'Ruim';
    }
}

export { NpsController };