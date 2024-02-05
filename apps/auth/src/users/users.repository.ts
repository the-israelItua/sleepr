import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UsersDocument } from "./models/users.schema";

@Injectable()
export class UsersRepository extends AbstractRepository<UsersDocument>{
    protected readonly logger = new Logger(UsersRepository.name)

    constructor(@InjectModel(UsersDocument.name) userModel: Model<UsersDocument>){
        super(userModel)
    }
}