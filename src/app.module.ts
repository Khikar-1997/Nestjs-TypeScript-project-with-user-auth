import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {LoggerMiddleware} from "./common/middleware/logger.middleware";
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {UsersController} from "./users/users.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {User} from "./users/entities/user.entity";

@Module({
    imports: [UsersModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'newuser',
            password: 'password',
            database: 'user_auth_project',
            entities: [User],
            synchronize: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    constructor(private connection: Connection) {
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .exclude(
                {path: 'users', method: RequestMethod.GET},
                {path: 'users', method: RequestMethod.POST},
                'users/.*',
            )
            .forRoutes(UsersController);
    }
}
