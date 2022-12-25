import { FormField } from "@/base/types/formTYpes";
import { IBaseFormModel } from "@/index";
import { timingSafeEqual } from "crypto";


type Field = FormField<any, any, any>;

class ValidatorTestHelper{
    constructor(){}
    testValidLink(model: IBaseFormModel<any, any, any>, aField: Field, bField: Field){
    }
}

export const validatorTestHelper = new ValidatorTestHelper();